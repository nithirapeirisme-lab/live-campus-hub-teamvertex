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


async function loginProcess() {
    const idField = document.getElementById('login-id');
    const passField = document.getElementById('login-pass');

    if (!idField || !passField) return; // Safety check

    const id = idField.value;
    const pass = passField.value;

    if (id.trim() === "" || pass.trim() === "") {
        alert("Please enter both your Student ID and Password.");
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
            userToken = data.jwt; 
            currentUserId = data.userId; 
            localStorage.setItem('jwt', userToken); 
            
            document.getElementById('user-display').innerText = data.firstName || "Student";
            showToast(`Welcome back, ${data.firstName || data.userId}!`); 
            

            if (data.role === 'ADMIN' || data.role === 'STAFF') {
                showView('admin-view');
            } else {
                showView('dashboard-view');
                refreshFacilityStatus(); 
            }
        }
    } catch (err) {
        console.error("Backend Connection Error:", err); 
        alert("Cannot connect to the server. Make sure your Spring Boot app is running on port 8081.");
    }
}

async function signupProcess() {
    const signupData = {
        userId: document.getElementById('signup-id').value,
        password: document.getElementById('signup-pass').value,
        firstName: document.getElementById('signup-fname').value,
        lastName: document.getElementById('signup-lname').value,
        email: document.getElementById('signup-email').value,
        phone: document.getElementById('signup-phone').value,
        enrolled_Year: document.getElementById('signup-year').value,
        department_id: document.getElementById('signup-dept').value,
        role: "STUDENT"
    };

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });
        if (response.ok) {
            showToast("Registration successful!");
            showView('login-view');
        }
    } catch (err) { console.error("Signup failed", err); }
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
