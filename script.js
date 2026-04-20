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
            currentUserId = id; 
            localStorage.setItem('jwt', userToken); 
            
            document.getElementById('user-display').innerText = data.username || id;
            showToast("Login Successful!"); 
            showView('dashboard-view');
            refreshFacilityStatus(); 
        } else {
            alert("Login failed! Please check your Student ID and Password.");
        }
    } catch (err) {
        console.error("Backend Connection Error:", err); 
        alert("Cannot connect to the server. Make sure your Spring Boot app is running on port 8081.");
    }
}

async function signupProcess() {
    const name = document.getElementById('signup-name').value;
    const id = document.getElementById('signup-id').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;

    if (!name || !id || !email || !pass) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const signupData = {
            userId: id,
            password: pass,
            firstName: name,
            email: email,
            role: "STUDENT"
        };

        const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        if (response.ok) {
            showToast("Registration successful! You can now log in.");
            showView('login-view');
        } else {
            alert("Registration failed. Student ID might already be taken.");
        }
    } catch (err) {
        console.error("Signup Error:", err);
        alert("Connection lost. Check your backend server.");
    }
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



document.getElementById('img-input')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file || !userToken) return;

    // 1. Keep the preview functionality
    const reader = new FileReader();
    reader.onload = (f) => document.getElementById('profile-img-display').src = f.target.result;
    reader.readAsDataURL(file);

    // 2. Add the backend upload
    const formData = new FormData();
    formData.append('file', file); 

    await fetch(`${BASE_URL}/api/v1/students/profile-image/${currentUserId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
        body: formData
    });
    showToast("Cloud Profile Updated!");
});
