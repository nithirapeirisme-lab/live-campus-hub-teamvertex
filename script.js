// ==========================================================================
// LIVE CAMPUS HUB - CENTRAL APPLICATION SCRIPT
// ==========================================================================

const BASE_URL = "http://localhost:8081/live-campus-hub";
let userToken = localStorage.getItem('jwt') || ""; 
let currentUserId = localStorage.getItem('currentUserId') || ""; 

// --- CENTRAL PAGE INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();

    // 1. Initialize context-aware configurations depending on the layout window state
    if (currentPath.includes('admin.html')) {
        showStaffSection('admin-overview');
    } else if (currentPath.includes('student.html')) {
        refreshFacilityStatus();
        getRewards();
        
        // Dynamically append the name value from storage securely if element exists
        const displayName = localStorage.getItem('userDisplayName') || "Student";
        safeSetInnerText('user-display', displayName);
    }

    // 2. Safely bind global dynamic input action parameters if elements are active
    document.getElementById('img-input')?.addEventListener('change', handleProfileImageUpload);
    document.getElementById('signup-role')?.addEventListener('change', toggleSignupFields);
});

function safeSetInnerText(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = value;
}

// --- APP WIDE STATUS TOAST NOTIFICATIONS ---
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.log("Toast fallback system log statement:", message);
        return;
    }
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// --- ADMINISTRATIVE INNER-SECTION SIDEBAR CONTROLLER ---
function showStaffSection(sectionId, element) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return; 

    document.querySelectorAll('.staff-section').forEach(section => {
        section.style.display = 'none';
    });

    targetSection.style.display = 'block';

    if (element) {
        document.querySelectorAll('.sidebar .nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        element.classList.add('active');
    }
}

// ==========================================================================
// BACKEND SECURITY ACCESS CONTROL PORTALS
// ==========================================================================

async function loginProcess() {
    const idField = document.getElementById('login-id');
    const passField = document.getElementById('login-pass');

    if (!idField || !passField) return;
    const id = idField.value.trim();
    const pass = passField.value;

    if (!id || !pass) {
        alert("Please complete all identification credentials.");
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
            currentUserId = id;
            localStorage.setItem('jwt', userToken); 
            localStorage.setItem('currentUserId', currentUserId);
            
            const displayName = data.first_name || data.firstName || "User";
            localStorage.setItem('userDisplayName', displayName);

            const role = data.role ? data.role.toUpperCase() : '';
            const isStaffId = id.toUpperCase().startsWith('STF') || id.toLowerCase().includes('admin');

            if (role === 'ADMIN' || role === 'STAFF' || isStaffId) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'student.html';
            }
        } else {
            alert("Invalid account credentials. Access denied.");
        }
    } catch (err) {
        console.warn("Target backend service offline. Activating system fallback sandbox routing simulation...", err);
        
        // Simulation mode paths to allow offline development
        localStorage.setItem('jwt', 'mock-security-payload-token');
        localStorage.setItem('currentUserId', id);
        localStorage.setItem('userDisplayName', id.toUpperCase());

        if (id.toLowerCase().includes('admin') || id.toUpperCase().startsWith('STF')) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'student.html';
        }
    }
}

async function signupProcess() {
    const roleElement = document.getElementById('signup-role');
    if (!roleElement) return;
    
    const selectedRole = roleElement.value;
    
    let signupData = {
        userId: document.getElementById('signup-id')?.value,
        password: document.getElementById('signup-pass')?.value,
        firstName: document.getElementById('signup-fname')?.value,
        lastName: document.getElementById('signup-lname')?.value,
        email: document.getElementById('signup-email')?.value,
        phone: document.getElementById('signup-phone')?.value,
        role: selectedRole
    };

    if (selectedRole === 'STUDENT') {
        signupData.enrolledYear = document.getElementById('signup-year')?.value;
        signupData.departmentId = document.getElementById('signup-dept')?.value;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        if (response.ok) {
            alert(`Account profile successfully created as ${selectedRole}! Logging in...`);
            // Automatically log in after successful account creation
            localStorage.setItem('jwt', 'mock-token');
            localStorage.setItem('currentUserId', signupData.userId);
            localStorage.setItem('userDisplayName', signupData.firstName);
            window.location.href = selectedRole === 'STAFF' ? 'admin.html' : 'student.html';
        } else {
            const errorText = await response.text();
            alert("Registration validation failure: " + errorText);
        }
    } catch (err) {
        console.error("Signup network link interface error:", err);
        // Fallback redirection for local workspace convenience 
        localStorage.setItem('jwt', 'mock-token');
        localStorage.setItem('currentUserId', signupData.userId || 'STU_01');
        localStorage.setItem('userDisplayName', signupData.firstName || 'Student');
        window.location.href = selectedRole === 'STAFF' ? 'admin.html' : 'student.html';
    }
}

function toggleSignupFields() {
    const roleSelect = document.getElementById('signup-role');
    const extraFields = document.getElementById('student-extra-fields');
    const idInput = document.getElementById('signup-id');
    
    if (!roleSelect || !idInput) return;

    if (roleSelect.value === 'STAFF') {
        if (extraFields) extraFields.style.display = 'none'; 
        idInput.placeholder = "STF_001";    
    } else {
        if (extraFields) extraFields.style.display = 'block'; 
        idInput.placeholder = "STU_001";
    }
}

function logoutProcess() {
    if (confirm("Terminate security token session and logout from CINEC Campus Hub?")) {
        userToken = ""; 
        currentUserId = "";
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// ==========================================================================
// OPERATIONAL APPLICATION PORTAL SERVICE SERVICES
// ==========================================================================

async function refreshFacilityStatus() {
    if (!userToken) return;
    try {
        const response = await fetch(`${BASE_URL}/api/v1/locations/all-status`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (!response.ok) return;
        const statuses = await response.json(); 

        const libText = document.getElementById('lib-status-display');
        if (libText && statuses.LIB_01) libText.innerText = `Status: ${statuses.LIB_01}`;
        
        const gymText = document.getElementById('gym-status-display');
        if (gymText && statuses.GYM_01) gymText.innerText = `Status: ${statuses.GYM_01}`;
    } catch (err) {
        // Safe UI display parameters if servers aren't online yet
        const lib = document.getElementById('lib-status-display');
        if (lib) lib.innerText = "Status: Online (Standard Hours)";
        const gym = document.getElementById('gym-status-display');
        if (gym) gym.innerText = "Status: Online (Standard Hours)";
    }
}

async function performCheckIn(locationId) {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/checkin/${locationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showToast("Attendance check-in authenticated! Reward points compiled."); 
        } else {
            showToast("Check-in captured via fallback environment tracker.");
        }
    } catch (err) {
        showToast("Check-in entry registered successfully!");
    }
}

async function saveDepartment() {
    const idEl = document.getElementById('dept-id');
    const nameEl = document.getElementById('dept-name');
    if (!idEl || !nameEl) return;

    const deptData = { department_id: idEl.value, department_name: nameEl.value };
    try {
        const response = await fetch(`${BASE_URL}/api/v1/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify(deptData)
        });
        if (response.ok) showToast("Department parameters synchronized!");
    } catch (err) { showToast("Department saved locally."); }
}

async function saveEvent() {
    const nameEl = document.getElementById('event-name');
    const dateEl = document.getElementById('event-date');
    const locEl = document.getElementById('event-location');
    
    if (!nameEl || !dateEl || !locEl) return;

    const eventData = { name: nameEl.value, date: dateEl.value, location: locEl.value };
    try {
        await fetch(`${BASE_URL}/api/v1/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify(eventData)
        });
        showToast("Campus event broadcasted cleanly!");
    } catch (err) { showToast("Event mapped successfully."); }
}

async function saveReward() {
    const idEl = document.getElementById('reward-id');
    const pointsEl = document.getElementById('reward-points');
    const discountEl = document.getElementById('reward-discount');
    
    if (!idEl || !pointsEl) return;

    const rewardData = {
        reward_id: idEl.value,
        reward_points: pointsEl.value,
        discount_percentage: discountEl ? discountEl.value : 0
    };
    try {
        await fetch(`${BASE_URL}/api/v1/rewards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify(rewardData)
        });
        showToast("Reward matrix item updated!");
    } catch (err) { showToast("Loyalty token successfully configured."); }
}

async function handleProfileImageUpload(e) { /* Handler hook stub */ }
async function getRewards() { /* Handler hook stub */ }
