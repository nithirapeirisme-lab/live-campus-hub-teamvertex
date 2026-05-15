const BASE_URL = "http://localhost:8081/live-campus-hub";
let userToken = localStorage.getItem('jwt') || ""; 
let currentUserId = ""; 



function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function switchTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = 'block';
    if (btn) btn.classList.add('active');
}



function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}


async function loginProcess(manualId = null, manualPass = null) {
    // 1. Get credentials from parameters (signup) or DOM (login page)
    const id = manualId || document.getElementById('login-id').value;
    const pass = manualPass || document.getElementById('login-pass').value;

    if (!id || !pass) {
        console.error("Login attempted without credentials");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: id, password: pass })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Full Backend Response:", data); // Check your F12 console!
            
            userToken = data.jwt; 
            localStorage.setItem('jwt', userToken); 
            
            // Handle name from both StudentEntity (firstName) and StaffEntity (first_name)
            const displayName = data.first_name || data.firstName || "User";
            document.getElementById('user-display').innerText = displayName;

            // --- IMPROVED REDIRECT LOGIC ---
            
            // Convert role to uppercase if it exists
            const role = data.role ? data.role.toUpperCase() : '';
            
            // Check for any variation of the admin/staff flag
            // (Java booleans can be serialized as is_admin, isAdmin, or admin)
            const hasAdminFlag = data.is_admin === true || data.isAdmin === true || data.admin === true;
            
            // Fallback: Check if the User ID starts with STF (Staff)
            const isStaffId = id.toUpperCase().startsWith('STF');

            if (role === 'ADMIN') {
                showView('admin-view');
            } else if (role === 'STAFF' || hasAdminFlag || isStaffId) {
                showView('staff-view');
                showStaffSection('staff-overview'); 
            } 
            else {
                console.log("Authorized as Student");
                showView('dashboard-view'); 
                refreshFacilityStatus(); 
            }
            // --- END REDIRECT LOGIC ---

        } else {
            alert("Login failed. Check your credentials.");
        }
    } catch (err) {
        console.error("Login Error:", err);
    }
}

async function signupProcess() {
    // 1. Capture the role selection right at the start
    const selectedRole = document.getElementById('signup-role').value;
    
    let signupData = {
        userId: document.getElementById('signup-id').value,
        password: document.getElementById('signup-pass').value,
        firstName: document.getElementById('signup-fname').value,
        lastName: document.getElementById('signup-lname').value,
        email: document.getElementById('signup-email').value,
        phone: document.getElementById('signup-phone').value,
        role: selectedRole
    };

    if (selectedRole === 'STUDENT') {
        signupData.enrolledYear = document.getElementById('signup-year').value;
        signupData.departmentId = document.getElementById('signup-dept').value;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        if (response.ok) {
            showToast(`Registered successfully as ${selectedRole}!`);
            
            // Get credentials for auto-login
            const id = signupData.userId;
            const pass = signupData.password;
            
            // Run the login process in the background to get the JWT
            await loginProcess(id, pass); 

            // 2. OVERRIDE REDIRECT: 
            // Even if loginProcess defaults to student, we FORCE the view based on what they just picked
            if (selectedRole === 'STAFF') {
                showView('staff-view');
            } else {
                showView('dashboard-view');
            }
            
            clearSignupForm();
        } else {
            const errorText = await response.text();
            alert("Signup failed: " + errorText);
        }
    } catch (err) {
        console.error("Signup error:", err);
    }
}


function clearSignupForm() {
    const fields = [
        'signup-id', 'signup-pass', 'signup-fname', 'signup-lname', 
        'signup-email', 'signup-phone', 'signup-year', 'signup-dept'
    ];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = "";
    });
    
    document.getElementById('signup-role').value = "STUDENT";
    toggleSignupFields(); 
}


function logoutProcess() {
    if (confirm("Log out from CINEC Hub?")) {
        userToken = ""; 
        showToast("Logged out successfully."); 
        showView('home-view');
    }
}



async function refreshFacilityStatus() {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/locations/all-status`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch status");
        
        const statuses = await response.json(); 

        
        if (statuses.LIB_01) {
            const libCard = document.querySelector('#tab-dashboard .card:nth-child(1) small');
            libCard.innerText = `Status: ${statuses.LIB_01}`;
        }
        if (statuses.GYM_01) {
            const gymCard = document.querySelector('#tab-dashboard .card:nth-child(2) small');
            gymCard.innerText = `Status: ${statuses.GYM_01}`;
        }
    } catch (err) {
        console.error("Facility status error:", err);
    }
}


async function performCheckIn(locationId) {
    if (!userToken) {
        alert("Please log in first.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/checkin/${locationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showToast("Check-in successful! Points added."); 
            refreshFacilityStatus(); 
        } else {
            const errorData = await response.json();
            alert(`Check-in failed: ${errorData.message || "Location not found"}`);
        }
    } catch (err) {
        console.error("Check-in error:", err);
        alert("Could not connect to the AWS Cloud database.");
    }
}


function saveProfile() {
    const name = document.getElementById('edit-name').value;
    const bio = document.getElementById('edit-bio').value; 
    
    if (name.trim() !== "") {
        document.getElementById('user-display').innerText = name;
        showToast("Profile and Bio Updated!");
    }
}

async function loadStudentProfile() {
    const response = await fetch(`${BASE_URL}/api/v1/students/me`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const data = await response.json();
    document.getElementById('edit-name').value = `${data.firstName} ${data.lastName}`;
}

async function getRewards() {
    const response = await fetch(`${BASE_URL}/api/v1/student_rewards/my-rewards`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const rewards = await response.json();
}



document.getElementById('img-input')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file || !userToken) return;

    const reader = new FileReader();
    reader.onload = (f) => document.getElementById('profile-img-display').src = f.target.result;
    reader.readAsDataURL(file);


    const formData = new FormData();
    formData.append('file', file); 

    await fetch(`${BASE_URL}/api/v1/students/profile-image/${currentUserId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
        body: formData
    });
    showToast("Cloud Profile Updated!");
});


document.getElementById('signup-role')?.addEventListener('change', function() {
    const idInput = document.getElementById('signup-id');
    if (this.value === 'STAFF') {
        idInput.placeholder = "STF_001";
    } else {
        idInput.placeholder = "STU_001";
    }
});

function toggleSignupFields() {
    const role = document.getElementById('signup-role').value;
    const extraFields = document.getElementById('student-extra-fields');
    const idInput = document.getElementById('signup-id');

    if (role === 'STAFF') {
        extraFields.style.display = 'none'; 
        idInput.placeholder = "STF_001";    
    } else {
        extraFields.style.display = 'block'; 
        idInput.placeholder = "STU_001";
    }
}


function showStaffSection(sectionId, element) {
    document.querySelectorAll('.staff-section').forEach(section => {
        section.style.display = 'none';
    });


    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
    }

    if (element) {
        document.querySelectorAll('.sidebar .nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        element.classList.add('active');
    }
}


async function loadAllBuses() {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/bus/get-all`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const buses = await response.json();
        // Here you would write logic to display them in a table
        console.log("All Buses:", buses);
    } catch (err) {
        console.error("Fetch Buses Error:", err);
    }
}

async function deleteBus(busId) {
    if(!confirm("Delete this bus?")) return;
    try {
        const response = await fetch(`${BASE_URL}/api/v1/bus/${busId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if(response.ok) showToast("Bus deleted");
    } catch (err) {
        console.error("Delete Error:", err);
    }
}


async function saveMultipleStudents(studentsArray) {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/students/save-students`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` 
            },
            body: JSON.stringify(studentsArray)
        });
        if(response.ok) showToast("All students enrolled!");
    } catch (err) {
        console.error("Bulk Save Error:", err);
    }
}

async function updateEvent(eventName, eventData) {
    // Endpoints from doc: /api/v1/events/name/{name}
    try {
        const response = await fetch(`${BASE_URL}/api/v1/events/name/${eventName}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` 
            },
            body: JSON.stringify(eventData)
        });
        if(response.ok) showToast("Event updated!");
    } catch (err) {
        console.error("Event Update Error:", err);
    }
}

async function createReward(rewardData) {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/rewards`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` 
            },
            body: JSON.stringify(rewardData)
        });
        if(response.ok) showToast("Reward created!");
    } catch (err) {
        console.error("Reward Error:", err);
    }
}


// 1. DEPARTMENT MANAGEMENT
async function saveDepartment() {
    const deptData = {
        department_id: document.getElementById('dept-id').value,
        department_name: document.getElementById('dept-name').value
    };
    try {
        const response = await fetch(`${BASE_URL}/api/v1/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify(deptData)
        });
        if (response.ok) showToast("Department saved!");
    } catch (err) { console.error(err); }
}

// 2. EVENT MANAGEMENT
async function saveEvent() {
    const eventData = {
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        club_id: document.getElementById('event-club').value
    };
    try {
        const response = await fetch(`${BASE_URL}/api/v1/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify(eventData)
        });
        if (response.ok) showToast("Event created successfully!");
    } catch (err) { console.error(err); }
}

// 3. REWARD MANAGEMENT
async function saveReward() {
    const rewardData = {
        reward_id: document.getElementById('reward-id').value,
        reward_points: document.getElementById('reward-points').value,
        discount_percentage: document.getElementById('reward-discount').value
    };
    try {
        const response = await fetch(`${BASE_URL}/api/v1/rewards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify(rewardData)
        });
        if (response.ok) showToast("Reward published!");
    } catch (err) { console.error(err); }
}
