const BASE_URL = "http://localhost:8081/live-campus-hub";
let userToken = ""; 



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
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;

    
    if (id.trim() !== "" && pass.trim() !== "") {
        userToken = "MOCK_JWT_TOKEN";
        
        showToast("Login Successful!"); 
        showView('dashboard-view');
        refreshFacilityStatus(); 
    } else {
        alert("Please enter both your Student ID and Password.");
    }
}

function signupProcess() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    
    if (name.trim() !== "" && email.includes("@")) {
        document.getElementById('user-display').innerText = name;
        showToast(`Welcome to CINEC Hub, ${name}!`);
        showView('dashboard-view');
    } else {
        alert("Please enter a valid name and email.");
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



document.getElementById('img-input')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('profile-img-display').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});
