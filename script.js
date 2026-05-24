const BASE_URL = "http://localhost:8081/live-campus-hub"; 
let userToken = localStorage.getItem('jwt') || ""; 
let currentUserId = localStorage.getItem('currentUserId') || ""; 


window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();

    if (currentPath.includes('admin.html')) {
        showStaffSection('admin-overview');
        refreshOverviewMetrics();
        loadUserManagementTabs();
        loadClubs();
        loadEvents();
        loadDepartments();
        loadFacilityLocations();
        loadRewardsCatalog();
        loadTransitLogistics();
    } else if (currentPath.includes('student.html')) {
        refreshFacilityStatus();
        getRewards();
        const displayName = localStorage.getItem('userDisplayName') || "Student";
        safeSetInnerText('user-display', displayName);
    }

    document.getElementById('img-input')?.addEventListener('change', handleProfileImageUpload);
    document.getElementById('signup-role')?.addEventListener('change', toggleSignupFields);
});


function getAuthHeaders() {
    const currentToken = localStorage.getItem('jwt');
    if (!currentToken) {
        console.warn("Attempting to fetch secure resource without an active JWT token!");
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken || ""}`
    };
}



function safeSetInnerText(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = value;
}

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



function showStaffSection(sectionId) {
    const sections = ['admin-overview', 'admin-users', 'admin-clubs', 'admin-facilities', 'admin-locations', 'admin-rewards', 'admin-transit'];
    sections.forEach(id => {
        const block = document.getElementById(id);
        if (block) block.style.display = (id === sectionId) ? 'block' : 'none';
    });

    const links = document.querySelectorAll('.sidebar-menu a');
    links.forEach(link => {
        if (link.getAttribute('onclick')?.includes(sectionId)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function toggleSignupFields() {
    const roleSelect = document.getElementById('signup-role');
    const studentFields = document.getElementById('student-extra-fields');
    
    if (!roleSelect || !studentFields) return;

    if (roleSelect.value === 'STUDENT') {
        studentFields.style.display = 'block';
    } else if (roleSelect.value === 'STAFF') {
        studentFields.style.display = 'none';
    }
}


async function loginProcess() {
    const idEl = document.getElementById('login-id');
    const passEl = document.getElementById('login-pass');
    
    if (!idEl?.value.trim() || !passEl?.value.trim()) {
        showToast("Please provide your login credentials, bro!");
        return;
    }

    const loginPayload = { username: idEl.value.trim(), password: passEl.value.trim() };

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginPayload)
        });


        if (response.ok) {
            const authData = await response.json();
            localStorage.setItem('jwt', authData.token);
            localStorage.setItem('currentUserId', authData.username);
            
            userToken = authData.token; 
            currentUserId = authData.username;
            

            sessionStorage.removeItem('isNewSignup');
            
            const userRoles = Array.isArray(authData.roles) ? authData.roles.join(',') : '';
            localStorage.setItem('userRoles', userRoles);
            
            showToast("Authenticated successfully!");
            
            setTimeout(() => {
                if (userRoles.includes('ROLE_STAFF') || userRoles.includes('STAFF') || userRoles.includes('ROLE_ADMIN')) {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "student.html";
                }
            }, 1000);
        } else {
            const errorText = await response.text();
            showToast(errorText || "Invalid credentials, bro. Try again!");
        }
    } catch (err) {
        console.error(err);
        showToast("Backend connection failure.");
    }
}

async function signupProcess() {
    const roleEl = document.getElementById('signup-role');
    const idEl = document.getElementById('signup-id');
    const passEl = document.getElementById('signup-pass');
    const fnameEl = document.getElementById('signup-fname');
    const lnameEl = document.getElementById('signup-lname');
    const emailEl = document.getElementById('signup-email');
    const phoneEl = document.getElementById('signup-phone');
    const yearEl = document.getElementById('signup-year');
    const deptEl = document.getElementById('signup-dept');

    const userIdValue = idEl?.value.trim();
    const passwordValue = passEl?.value.trim();

    if (!userIdValue || !passwordValue || !roleEl?.value) {
        showToast("Please fulfill the required registration blocks!");
        return;
    }

    const signupPayload = {
        userId: userIdValue,
        password: passwordValue,
        role: roleEl.value.toUpperCase(),
        firstName: fnameEl ? fnameEl.value.trim() : "",
        lastName: lnameEl ? lnameEl.value.trim() : "",
        email: emailEl ? emailEl.value.trim() : "",
        phone: phoneEl ? phoneEl.value.trim() : "",
        enrolled_Year: yearEl ? parseInt(yearEl.value) || 2026 : 2026,
        department_id: deptEl ? deptEl.value.trim() : ""
    };

    try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupPayload)
        });

        const statusMessage = await response.text();
        
        if (response.ok) {
            showToast("Account created! Logging you in automatically... 🚀");
            const loginPayload = { username: userIdValue, password: passwordValue };
            
            const loginResponse = await fetch(`${BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginPayload)
            });

            if (loginResponse.ok) {
                const authData = await loginResponse.json();
            
                localStorage.setItem('jwt', authData.token);
                localStorage.setItem('currentUserId', authData.username);
                userToken = authData.token; 
                currentUserId = authData.username;
                
                const userRoles = Array.isArray(authData.roles) ? authData.roles.join(',') : '';
                localStorage.setItem('userRoles', userRoles);


                sessionStorage.setItem('isNewSignup', 'true');
                
                showToast("Account created! Logging you in automatically... 🚀");
                setTimeout(() => {
                    window.location.href = "student.html";
                }, 1000);
            } else {
                showToast("Account ready, but auto-login missed. Moving to sign-in panel.");
                setTimeout(() => { window.location.href = "login.html"; }, 1500); }
        } else {
            showToast(statusMessage || "Registration failed.");
        }
        
    } catch (err) {
        console.error(err);
        showToast("Could not contact authentication backend.");
    }
}

async function saveLocationObj() {
    const id = document.getElementById('loc-id').value.trim();
    const name = document.getElementById('loc-name').value.trim();
    const capacity = document.getElementById('loc-capacity').value.trim();

    if (!id || !name || !capacity) {
        return alert("Please fill out all fields!");
    }


    const payload = {
        location_id: id,       
        location_name: name,     
        capacity: capacity   
    };

    console.log("Payload sent to Jackson deserializer:", payload);

    try {
        const res = await fetch(`${BASE_URL}/api/v1/locations`, {
            method: 'POST',
            headers: getAuthHeaders(), 
            body: JSON.stringify(payload) 
        });

        if (res.ok || res.status === 201) {
            showToast("Location saved successfully!");
            document.getElementById('loc-id').value = '';
            document.getElementById('loc-name').value = '';
            document.getElementById('loc-capacity').value = '';
            if (typeof loadFacilityLocations === 'function') loadFacilityLocations();
        } else {
            console.error("Backend validation failed:", await res.text());
        }
    } catch (e) {
        console.error("Network link failure:", e);
    }
}

async function updateLocationObj() {
    const id = document.getElementById('loc-id')?.value.trim() || "";
    const name = document.getElementById('loc-name')?.value.trim() || "";
    const capacity = document.getElementById('loc-capacity')?.value.trim() || "";

    if (!id) {
        return alert("Validation Blocked: You must provide a Location ID Code to perform an update update operation!");
    }
    if (!name || !capacity) {
        return alert("Please fill out both Location Name and Live Operational Status fields to update details.");
    }


    const payload = {
        location_id: id,      
        location_name: name,   
        capacity: capacity
    };

    console.log("Initiating PUT update request sequence with payload:", payload);

    try {
        const res = await fetch(`${BASE_URL}/api/v1/locations`, { 
            method: 'PUT',
            headers: getAuthHeaders(), 
            body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 200) {
            showToast("Infrastructure Location details updated successfully!");
            

            document.getElementById('loc-id').value = '';
            document.getElementById('loc-name').value = '';
            document.getElementById('loc-capacity').value = '';
            
            if (typeof loadFacilityLocations === 'function') {
                loadFacilityLocations();
            }
        } else {
            const errorText = await res.text();
            console.error(`Backend rejected update action (${res.status}):`, errorText);
            alert(`Update Failed: ${errorText || 'Check if the Location ID exists in the database.'}`);
        }
    } catch (e) {
        console.error("Network communication exception encountered during update pipeline:", e);
        alert("Network failure: Server is unreachable.");
    }
}

async function deleteLocationObj(locationId) {
    if (!confirm(`Are you sure you want to permanently delete location ${locationId}?`)) {
        return;
    }

    console.log(`Initiating DELETE request for locationId: ${locationId}`);

    try {
        const res = await fetch(`${BASE_URL}/api/v1/locations/${locationId}`, {
            method: 'DELETE',
            headers: getAuthHeaders() 
        });

        if (res.ok || res.status === 200 || res.status === 204) {
            showToast("Location successfully purged from infrastructure matrix!");
            
            if (typeof loadFacilityLocations === 'function') {
                loadFacilityLocations();
            }
        } else {
            const errorText = await res.text();
            console.error(`Backend rejected deletion request (${res.status}):`, errorText);
            alert(`Delete Failed: ${errorText || 'Verify your user account permissions.'}`);
        }
    } catch (e) {
        console.error("Network communication exception during delete operation:", e);
        alert("Network failure: Server is unreachable.");
    }
}



async function refreshOverviewMetrics() {
    try {
        const sRes = await fetch(`${BASE_URL}/api/v1/students`, { method: 'GET', headers: getAuthHeaders() });
        if (sRes.ok) {
            const students = await sRes.json();
            safeSetInnerText('metric-active-students', students.length);
        }
        const dRes = await fetch(`${BASE_URL}/api/v1/departments`, { method: 'GET', headers: getAuthHeaders() });
        if (dRes.ok) {
            const depts = await dRes.json();
            safeSetInnerText('metric-departments', depts.length);
        }
        const stRes = await fetch(`${BASE_URL}/api/v1/staff`, { method: 'GET', headers: getAuthHeaders() });
        if (stRes.ok) {
            const staff = await stRes.json();
            safeSetInnerText('metric-staff', staff.length);
        }
    } catch (e) {
        console.error("Metrics breakdown error:", e);
    }
}


async function loadUserManagementTabs() {
    const studentTable = document.getElementById('student-table-body');
    const staffTable = document.getElementById('staff-table-body');


    try {
        const response = await fetch(`${BASE_URL}/api/v1/students`, { method: 'GET', headers: getAuthHeaders() });
        if (response.ok && studentTable) {
            const data = await response.json();
            studentTable.innerHTML = '';
            
            data.forEach(student => {
                const id = student.studentId || student.student_id || 'N/A';
                const fname = student.firstName || student.first_name || '';
                const lname = student.lastName || student.last_name || '';
                const email = student.email || 'N/A';
                const dept = student.departmentId || student.department_id || 'N/A';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${fname} ${lname}</td>
                    <td>${email}</td>
                    <td><span class="dept-tag">${dept}</span></td>
                    <td class="center-text">
                        <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;" onclick="deleteStudentObj('${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                studentTable.appendChild(tr);
            });
        }
    } catch (e) { console.error("Error formatting student row alignments:", e); }

    try {
        const response = await fetch(`${BASE_URL}/api/v1/staff`, { method: 'GET', headers: getAuthHeaders() });
        if (response.ok && staffTable) {
            const data = await response.json();
            staffTable.innerHTML = '';
            
            data.forEach(staff => {
                const id = staff.staffId || staff.staff_id || 'N/A';
                const fname = staff.firstName || staff.first_name || '';
                const lname = staff.lastName || staff.last_name || '';
                const email = staff.email || 'N/A';
                const isAdmin = staff.isAdmin !== undefined ? staff.isAdmin : staff.is_admin;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${fname} ${lname}</td>
                    <td>${email}</td>
                    <td><span class="badge ${isAdmin ? 'badge-admin' : 'badge-staff'}">${isAdmin ? 'Admin' : 'Staff'}</span></td>
                    <td class="center-text">
                        <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;" onclick="deleteStaffObj('${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                staffTable.appendChild(tr);
            });
        }
    } catch (e) { console.error("Error formatting staff row alignments:", e); }
}

async function deleteStudentObj(id) {
    if (!confirm(`Purge Student [${id}] from live operational databases?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/students/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok || res.status === 204) {
            showToast("Student deleted.");
            loadUserManagementTabs();
            refreshOverviewMetrics();
        }
    } catch (e) { console.error(e); }
}

async function deleteStaffObj(id) {
    if (!confirm(`Purge Staff Member [${id}] from active registry?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/staff/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok || res.status === 204) {
            showToast("Staff record removed.");
            loadUserManagementTabs();
            refreshOverviewMetrics();
        }
    } catch (e) { console.error(e); }
}
async function loadClubs() {
    const tbody = document.getElementById('clubs-table-body');
    if (!tbody) return;
    try {
        const response = await fetch(`${BASE_URL}/api/v1/clubs`, { method: 'GET', headers: getAuthHeaders() });
        if (response.ok) {
            const data = await response.json();
            tbody.innerHTML = '';
            data.forEach(club => {
                const id = club.clubId || club.club_id;
                const name = club.clubName || club.club_name;
                const desc = club.description || 'No descriptive details declared.';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${name}</td>
                    <td>${desc}</td>
                    <td class="center-text">
                        <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;" onclick="deleteClubObj('${id}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) { console.error(e); }
}

async function saveClub() {
    const clubIdInput = document.getElementById('club-id');
    const clubNameInput = document.getElementById('club-name');
    const clubStatusInput = document.getElementById('club-status');


    if (!clubIdInput || !clubNameInput || !clubStatusInput) {
        console.error("HTML ID Mismatch! Check your id attributes.");
        return alert("Developer Error: One of the HTML element IDs ('club-id', 'club-name', 'club-status') was not found!");
    }

    const id = clubIdInput.value.trim();
    const name = clubNameInput.value.trim();
    const status = clubStatusInput.value.trim();

    if (!id || !name) { 
        return alert("Please fill out both the Club ID and Club Name, bro!"); 
    }


    const payload = { 
        club_id: id, 
        clubName: name,     
        status: status      
    };

    console.log("Sending clean Club payload:", payload);

    try {
        const res = await fetch(`${BASE_URL}/api/v1/clubs`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        
        if (res.ok || res.status === 201) {
            showToast("Club saved successfully!");
            
            clubIdInput.value = '';
            clubNameInput.value = ''; 
            clubStatusInput.value = '';
            
            loadClubs();
        } else {
            const backendError = await res.text();
            console.error(`Backend rejected save (${res.status}):`, backendError);
            alert(`Failed to save: ${backendError}`);
        }
    } catch (e) { 
        console.error("Network error:", e); 
    }
}

async function deleteClubObj(id) {
    if (!confirm(`Extract club node [${id}]?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/clubs/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok || res.status === 204) {
            showToast("Club removed.");
            loadClubs();
        }
    } catch (e) { console.error(e); }
}


async function loadEvents() {
    const tbody = document.getElementById('facilities-table-body');
    if (!tbody) return;
    
    try {
        const response = await fetch(`${BASE_URL}/api/v1/events`, { 
            method: 'GET', 
            headers: getAuthHeaders() 
        });
        
        if (response.ok) {
            const data = await response.json();
            tbody.innerHTML = ''; 

            data.forEach(evt => {
                const id = evt.eventId || evt.event_id || 'N/A';
                const title = evt.title || evt.eventTitle || evt.eventName || evt.event_name || 'Untitled Event';
                const date = evt.date || evt.event_date || 'Pending Schedule';
                const time = evt.time || evt.event_time || evt.eventTime || 'N/A';
                const club = evt.club || evt.club_name || evt.clubName || 'General';
                const loc = evt.locationName || evt.location_name || evt.location_id || 'Main Campus';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${title}</td>
                    <td>${date}</td>
                    <td><span style="color: #475569;"><i class="far fa-clock"></i> ${time}</span></td>
                    <td><span style="font-weight: 500; color: var(--cinec-navy);">${club}</span></td>
                    <td><span class="loc-tag"><i class="fas fa-map-marker-alt"></i> ${loc}</span></td>
                    <td class="center-text">
                        <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;" onclick="deleteEventObj('${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error("Events endpoint returned error code:", response.status);
        }
    } catch (e) { 
        console.error("Error formatting event row alignments:", e); 
    }
}

async function saveEvent() {
    const title = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value.trim();
    const time = document.getElementById('event-time').value;
    const location = document.getElementById('event-location')?.value || ''; 
    const club = document.getElementById('event-org')?.value || '';

    if ( !title) return alert("Fill in Event ID and Title!");

    const payload = { 
        eventTitle: title, 
        event_date: date, 
        event_time: time,
        location_name: location,
        club_name: club,
        
    };

    try {
        const res = await fetch(`${BASE_URL}/api/v1/events`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok || res.status === 201) {
            showToast("Event successfully logged.");
            document.getElementById('event-name').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-time').value = '';
            document.getElementById('event-location').value = '';
            document.getElementById('event-org').value = '';
            
            loadEvents();
        }
    } catch (e) { console.error(e); }
}

async function updateEvent() {
    const title = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value.trim();
    const time = document.getElementById('event-time').value;
    const location = document.getElementById('event-location')?.value || ''; 
    const club = document.getElementById('event-org')?.value || '';

    if (!title) {
        return alert("Fill in the Event Title!");
    }

    const payload = {             
        eventTitle: title,        
        event_date: date,         
        event_time: time,         
        location_name: location,  
        club_name: club           
    };

    console.log("Initiating PUT update request with payload:", payload);

    try {
        const res = await fetch(`${BASE_URL}/api/v1/events/name/{eventName}`, {
            method: 'PUT',
            headers: getAuthHeaders(), 
            body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 200) {
            showToast("Event successfully updated in database matrix.");
            
            document.getElementById('event-id').value = id;
            document.getElementById('event-name').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-time').value = '';
            document.getElementById('event-location').value = '';
            document.getElementById('event-org').value = '';
            

            if (typeof loadEvents === 'function') {
                loadEvents();
            }
        } else {
            const errorText = await res.text();
            console.error(`Backend update failure (${res.status}):`, errorText);
            alert(`Update Failed: ${errorText || 'Check server logs for database constraint failures.'}`);
        }
    } catch (e) { 
        console.error("Network communication exception layer failure:", e); 
        alert("Network failure: Server is unreachable.");
    }
}

async function deleteEventObj(id) {
    if (!confirm(`Cancel scheduled event entry [${id}]?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/events/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok || res.status === 204) {
            showToast("Event discarded.");
            loadEvents();
        }
    } catch (e) { console.error(e); }
}



async function loadFacilityLocations() {
    const tbody = document.getElementById('locations-table-body');
    if (!tbody) return;
    try {
        const locRes = await fetch(`${BASE_URL}/api/v1/locations`, { method: 'GET', headers: getAuthHeaders() });
        const statRes = await fetch(`${BASE_URL}/api/v1/locations/all-status`, { method: 'GET', headers: getAuthHeaders() });

        if (locRes.ok && statRes.ok) {
            const locations = await locRes.json();
            const liveStatuses = await statRes.json();
            tbody.innerHTML = '';

            locations.forEach(loc => {
                const id = loc.locationId || loc.location_id;
                const name = loc.locationName || loc.location_name;
                const cap = loc.capacity || 0;
                const status = liveStatuses[id] || "EMPTY";

                let colorStyle = "background:#dcfce7; color:#15803d;";
                if (status === "MODERATE") colorStyle = "background:#fef3c7; color:#b45309;";
                if (status === "CROWDED") colorStyle = "background:#fee2e2; color:#b91c1c;";

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${name}</td>
                    <td>${cap} spaces max</td>
                    <td><span style="padding:4px 8px; border-radius:6px; font-weight:600; font-size:0.8rem; ${colorStyle}">${status}</span></td>
                    <td style="padding: 12px; text-align: center;">
                        <button class="btn-action edit-btn" onclick="editLocation('${id}')" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 1.1rem; padding: 4px;" title="Edit Location">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete-btn" onclick="deleteLocationObj('${id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; margin-left: 14px; padding: 4px;" title="Delete Location">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) { console.error(e); }
}

async function loadRewardsCatalog() {
    const tbody = document.getElementById('rewards-table-body');
    if (!tbody) return;
    try {
        const response = await fetch(`${BASE_URL}/api/v1/rewards`, { method: 'GET', headers: getAuthHeaders() });
        if (response.ok) {
            const data = await response.json();
            tbody.innerHTML = '';
            
            data.forEach(rew => {
                const id = rew.rewardId || rew.reward_id;
                const name = rew.rewardName || rew.reward_name;
                const points = rew.pointsRequired || rew.reward_points || 0;
                const discount = rew.discountPercentage || rew.discount_percentage || 0;

                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${name}</td>
                    <td>${points} Points</td>
                    <td><span style="padding:4px 8px; border-radius:6px; font-weight:600; font-size:0.8rem; background: #e0f2fe; color: #0369a1;">${discount}% Off</span></td>
                    <td style="padding: 12px; text-align: center;">
                        <button class="btn-action edit-btn" onclick="editRewardObj('${id}')" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 1rem;" title="Edit Reward">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete-btn" onclick="deleteRewardObj('${id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1rem; margin-left: 12px;" title="Delete Reward">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) { 
        console.error("Failed to parse rewards grid array matrices:", e); 
    }
}

function editRewardObj(id) {
    console.log(`Loading reward details for ID: ${id}`);
    const rows = document.querySelectorAll("#rewards-table-body tr");
    let targetName = "";
    let targetPoints = "";
    let targetDiscount = "";

    rows.forEach(row => {
        if (row.cells[0].innerText.trim() === id) {
            targetName = row.cells[1].innerText.trim();
            targetPoints = parseInt(row.cells[2].innerText) || 0;
            targetDiscount = parseInt(row.cells[3].innerText) || 0;
        }
    });

    if (document.getElementById('reward-id')) document.getElementById('reward-id').value = id;
    if (document.getElementById('reward-name')) document.getElementById('reward-name').value = targetName;
    if (document.getElementById('reward-points')) document.getElementById('reward-points').value = targetPoints;
    if (document.getElementById('reward-discount')) document.getElementById('reward-discount').value = targetDiscount;
}

async function saveRewardListing() {
    const id = document.getElementById('reward-id').value.trim();
    const name = document.getElementById('reward-name').value.trim();
    const points = document.getElementById('reward-points').value.trim();
    const discount = document.getElementById('reward-discount').value.trim();

    if (!id || !name || !points || !discount) return alert("Fill out all Loyalty Reward variables!");

    const payload = { reward_id: id, reward_name: name, discount_percentage: discount, reward_points: parseFloat(points) };

    try {
        const res = await fetch(`${BASE_URL}/api/v1/rewards`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok || res.status === 201) {
            showToast("Reward listing published.");
            document.getElementById('reward-id').value = '';
            document.getElementById('reward-name').value = '';
            document.getElementById('reward-points').value = '';
            document.getElementById('reward-discount').value = '';
            loadRewardsCatalog();
        }
    } catch (e) { console.error(e); }
}

async function saveBus() {
    try {
        const formatToBackendDateTime = (timeStr) => {
            if (!timeStr) return null;
            

            let cleanTime = timeStr.trim().replace('.', ':').toUpperCase();
            
            const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/;
            const match = cleanTime.match(timeRegex);
            
            if (!match) {
                console.warn(`Time text "${timeStr}" could not be auto-formatted.`);
                return null;
            }
            
            let [_, hours, minutes, modifier] = match;
            hours = parseInt(hours, 10);
            
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            
            const paddedHours = String(hours).padStart(2, '0');
            const paddedMinutes = String(minutes).padStart(2, '0');
            
            return `2026-05-24T${paddedHours}:${paddedMinutes}:00`;
        };

        const busData = {
            bus_id: document.getElementById('config-bus-id')?.value || "",
            busNumber: document.getElementById('config-bus-number')?.value || "",
            status: document.getElementById('config-bus-status')?.value || "ON_TIME",
            departure: document.getElementById('config-bus-departure')?.value || "",
            arrival: document.getElementById('config-bus-arrival')?.value || "",
            departure_time: formatToBackendDateTime(document.getElementById('config-bus-deptime')?.value),
            arrival_time: formatToBackendDateTime(document.getElementById('config-bus-arrtime')?.value)
        };

        console.log("Sending normalized validation payload:", busData);

        const response = await fetch(`${BASE_URL}/api/v1/bus/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(busData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server error details (${response.status}):`, errorText);
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bus successfully saved to backend:', data);
        alert('Bus data saved successfully!');
        return data;
        
    } catch (error) {
        console.error('Failed to save bus:', error);
        alert(`Failed to save bus data: ${error.message}`);
        throw error;
    }
}

async function deleteRewardObj(id) {
    if (!confirm(`Are you sure you want to permanently delete reward ${id}?`)) return;

    try {
        const res = await fetch(`${BASE_URL}/api/v1/rewards/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (res.ok || res.status === 200 || res.status === 204) {
            showToast("Reward successfully removed from catalog.");
            loadRewardsCatalog(); 
        } else {
            console.error("Backend rejected target reward deletion sequence.");
        }
    } catch (e) {
        console.error("Network communication exception tracking failure:", e);
    }
}

function updateRewardListing() {
    const id = document.getElementById('reward-id').value;
    const points = document.getElementById('reward-points').value;
    const discount = document.getElementById('reward-discount').value;

    if (!id) {
        alert("Please specify a valid Reward Token Identifier to apply updates.");
        return;
    }

    fetch(`${BASE_URL}/api/v1/rewards/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            points: parseInt(points),
            discount: parseInt(discount)
        })
    })
    .then(res => {
        if(res.ok) {
            alert("Reward configuration updated successfully!");
            loadRewardsListing(); 
        } else {
            alert("Failed to modify reward metrics parameters.");
        }
    })
    .catch(err => console.error("Error processing update routine:", err));
}

async function loadTransitLogistics() {
    const tbody = document.getElementById('transit-table-body');
    if (!tbody) {
        console.warn("Could not find element ID: 'transit-table-body' in your HTML!");
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/api/v1/bus/get-all`, { 
            method: 'GET', 
            headers: getAuthHeaders() 
        });

        if (response.ok) {
            const data = await response.json();
            tbody.innerHTML = ''; 

            data.forEach(bus => {
                const id = bus.bus_id || 'N/A';
                const busNum = bus.bus_number || 'N/A';
                const status = bus.status || 'UNKNOWN';
                const routeFrom = bus.departure || 'N/A';
                const routeTo = bus.arrival || 'N/A';
                

                const depTime = bus.departure_time ? new Date(bus.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A';
                const arrTime = bus.arrival_time ? new Date(bus.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A';


                let badgeStyle = "background:#dcfce7; color:#15803d;"; 
                if (status === "DELAYED" || status === "SUSPENDED") {
                    badgeStyle = "background:#fee2e2; color:#b91c1c;"; 
                } else if (status === "MAINTENANCE") {
                    badgeStyle = "background:#fef3c7; color:#b45309;"; 
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${busNum}</td>
                    <td>
                        <span style="font-weight: 600; color: var(--cinec-navy);">
                            ${routeFrom} <i class="fas fa-long-arrow-alt-right" style="margin: 0 4px; color: var(--cinec-sky);"></i> ${routeTo}
                        </span>
                        <br>
                        <small style="color: #666;">${depTime} - ${arrTime}</small>
                    </td>
                    <td>
                        <span style="padding:4px 8px; border-radius:6px; font-weight:600; font-size:0.8rem; ${badgeStyle}">
                            ${status.replace('_', ' ')}
                        </span>
                    </td>
                    <td class="center-text">
                        <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;" onclick="deleteTransitObj('${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error("Transit API responded with error code:", response.status);
        }
    } catch (e) {
        console.error("Network or parsing execution error in Transit Module:", e);
    }
}

async function deleteTransitObj(id) {
    if (!confirm(`Purge Transit Bus [${id}] from active registry tracking?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/transit/${id}`, { 
            method: 'DELETE', 
            headers: getAuthHeaders() 
        });
        if (res.ok || res.status === 204) {
            showToast("Transit asset removed safely.");
            loadTransitLogistics(); 
        } else {
            showToast("Failed to remove transit asset.");
        }
    } catch (e) { 
        console.error("Transit delete error:", e); 
    }
}


function toggleChatbotOverlayWindow() {
    const win = document.getElementById('chatbot-window-panel');
    if (win) win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
}

async function dispatchChatbotQueryMessage() {
    const inputEl = document.getElementById('chat-query-input');
    const container = document.getElementById('chat-messages-container');
    if (!inputEl || !container || !inputEl.value.trim()) return;

    const userMessage = inputEl.value.trim();
    const userBubble = document.createElement('div');
    userBubble.className = "chat-bubble user";
    userBubble.innerText = userMessage;
    container.appendChild(userBubble);
    inputEl.value = '';
    container.scrollTop = container.scrollHeight;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/chatbot/ask?message=${encodeURIComponent(userMessage)}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`, 'Content-Type': 'application/json' }
        });
        
        const botBubble = document.createElement('div');
        botBubble.className = "chat-bubble bot";
        
        if (response.ok) {
            let data = await response.text();
            
            if (data.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(data);
                    data = parsed.answer || parsed.response || data;
                } catch(e) { /* Fallback if not valid JSON */ }
            }


            data = data.trim().replace(/^["']|["']$/g, '');

            data = data.replace(/^answer:\s*/i, '');


            data = data.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            

            data = data.replace(/^[*-]\s*(.*)$/gm, '• $1');

            data = data.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');

            botBubble.innerHTML = data || "Processed query successfully!";
        } else {
            botBubble.innerText = "Error pulling response from AI Assistant.";
        }
        container.appendChild(botBubble);
    } catch (err) {
        console.error(err);
        const errBubble = document.createElement('div');
        errBubble.className = "chat-bubble bot";
        errBubble.innerText = "Connection timed out. AI Core Offline.";
        container.appendChild(errBubble);
    }
    container.scrollTop = container.scrollHeight;
}


async function refreshFacilityStatus() { console.log("Status lookup initiated."); }
async function getRewards() { console.log("Inventory mapping pulled."); }

function switchStudentTab(targetTabId) {
    document.querySelectorAll('.student-panel').forEach(panel => panel.style.display = 'none');
    

    document.querySelectorAll('.sidebar .nav-item').forEach(item => item.classList.remove('active'));


    const selectedPanel = document.getElementById(targetTabId);
    if (selectedPanel) selectedPanel.style.display = 'block';

    const triggerLink = document.querySelector(`.sidebar .nav-item[onclick*="${targetTabId}"]`);
    if (triggerLink) triggerLink.classList.add('active');
    if (targetTabId === 'tab-profile') loadMyProfileAndDepartments();
    if (targetTabId === 'tab-checkin') fetchMyCheckInHistory();
    if (targetTabId === 'tab-buses') fetchAllCampusBuses();
    if (targetTabId === 'tab-clubs') {
        fetchAllCampusClubs();
        fetchMyEnrolledClubs(); 
    }
    if (targetTabId === 'tab-events') fetchAllUpcomingEvents();
    if (targetTabId === 'tab-locations') fetchAllLocationsAndStatuses();
    if (targetTabId === 'tab-directory') toggleDirectoryMode('STUDENTS');
    if (targetTabId === 'tab-rewards') fetchMyEarnedRewards();
}

if (window.location.pathname.toLowerCase().includes('student.html')) {
    window.addEventListener('DOMContentLoaded', () => {
        switchStudentTab('tab-profile');
    });
}

async function fetchAllCampusBuses() {
    const grid = document.getElementById('transit-bus-cards-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/bus/get-all`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            grid.innerHTML = data.map(bus => {
                const depTime = bus.departure_time ? bus.departure_time.replace('T', ' ') : 'N/A';
                const arrTime = bus.arrival_time ? bus.arrival_time.replace('T', ' ') : 'N/A';

                const statusColor = bus.status === 'ON_TIME' ? '#2ec4b6' : '#e63946';

                return `
                    <div class="card" style="border-left: 5px solid var(--cinec-sky); padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background: #ffffff;">
                        <!-- Header with Bus ID and Status -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="color: var(--cinec-navy); margin: 0;">
                                <i class="fas fa-bus-alt"></i> ${bus.bus_id || 'N/A'}
                            </h4>
                            <span style="background: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">
                                ${bus.status || 'UNKNOWN'}
                            </span>
                        </div>
                        
                        <!-- Route Details -->
                        <p style="font-size:0.9rem; margin: 4px 0;"><strong>Bus Number:</strong> ${bus.bus_number || 'N/A'}</p>
                        <p style="font-size:0.9rem; margin: 4px 0;"><strong>From (Departure):</strong> ${bus.departure || 'N/A'}</p>
                        <p style="font-size:0.9rem; margin: 4px 0;"><strong>To (Arrival):</strong> ${bus.arrival || 'N/A'}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 10px 0;">
                        
                        <!-- Timeline -->
                        <p style="font-size:0.8rem; color: var(--text-muted); margin: 3px 0;"><strong>Dept. Time:</strong> ${depTime}</p>
                        <p style="font-size:0.8rem; color: var(--text-muted); margin: 3px 0;"><strong>Arrv. Time:</strong> ${arrTime}</p>
                    </div>
                `;
            }).join('');
        }
    } catch (e) { 
        console.error("Transit collection fault:", e); 
    }
}





async function submitNodeCheckIn() {
    const nodeInput = document.getElementById('qr-scanned-location');
    const locationId = nodeInput?.value.trim();
    if (!locationId) { showToast("Provide a Location Node key parameter!"); return; }

    try {
        const res = await fetch(`${BASE_URL}/api/v1/checkIn`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ locationId: locationId })
        });
        if (res.ok) {
            showToast("Gateway Node identity validated! Check-In verified. 🎉");
            nodeInput.value = '';
            fetchMyCheckInHistory();
        } else {
            showToast("Failed to authenticate location parameters.");
        }
    } catch (e) { console.error(e); }
}

async function fetchMyCheckInHistory() {
    const tbody = document.getElementById('checkin-history-rows');
    if (!tbody) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/checkIn/my-history`, { headers: getAuthHeaders() });
        if (res.ok) {
            const history = await res.json();
            tbody.innerHTML = history.map(log => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <!-- Added log.log_id fallback -->
                    <td style="padding: 10px; font-size: 0.9rem;">${log.id || log.log_id || log.checkin_id || 'N/A'}</td>
                    
                    <!-- Added log.location_id fallback -->
                    <td style="padding: 10px; font-weight: bold; color: var(--cinec-sky);">${log.locationId || log.nodeId || log.location_id || 'Campus Node'}</td>
                    
                    <!-- Added log.check_in_time and log.checkTime fallbacks -->
                    <td style="padding: 10px; font-size: 0.85rem; color: var(--text-muted);">${log.timestamp || log.checkTime || log.check_in_time || 'N/A'}</td>
                </tr>
            `).join('');
        }
    } catch (e) { console.error(e); }
}



async function fetchAllCampusClubs() {
    const grid = document.getElementById('clubs-listing-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/clubs`, { headers: getAuthHeaders() });
        if (res.ok) {
            const clubs = await res.json();
            grid.innerHTML = clubs.map(club => {
                const realClubId = club.clubId || club.club_id || club.id;
                const realClubName = club.club_name || club.name || 'Unnamed Club';
                
                return `
                    <div class="card" style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h4 style="color: var(--cinec-navy); margin-bottom: 4px;"><i class="fas fa-flag"></i> ${realClubName}</h4>
                        <small style="display:block; font-family:monospace; color:#94a3b8; margin-bottom:15px;">${realClubId}</small>
                        <button class="btn btn-primary" style="width:100%; padding:8px; font-size:0.85rem;" onclick="performJoinClub('${realClubId}')">Join Association</button>
                    </div>
                `;
            }).join('');
        }
    } catch (e) { 
        console.error("All Clubs rendering fault: ", e); 
    }
}

async function fetchMyEnrolledClubs() {
    const myGrid = document.getElementById('my-clubs-listing-grid');
    if (!myGrid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/students_club`, { headers: getAuthHeaders() });
        
        if (res.ok) {
            const joinedClubs = await res.json();
            
            if (joinedClubs.length === 0) {
                myGrid.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; grid-column: 1/-1;">You haven't joined any clubs yet.</p>`;
                return;
            }

            myGrid.innerHTML = joinedClubs.map(club => {
                const realClubId = club.clubId || club.club_id || club.id;
                const realClubName = club.club_name || club.name || 'Unnamed Club';
                
                return `
                    <div class="card" style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h4 style="color: var(--cinec-navy); margin-bottom: 4px;"><i class="fas fa-flag"></i> ${realClubName}</h4>
                        <small style="display:block; font-family:monospace; color:#94a3b8; margin-bottom:15px;">${realClubId}</small>
                        <div style="display:flex; gap:8px;">
                            <button class="btn btn-outline" style="flex:1; padding:6px; font-size:0.75rem; color:var(--danger); border-color:var(--danger);" onclick="performLeaveClub('${realClubId}')">Leave (Purge)</button>
                            <button class="btn btn-outline" style="flex:1; padding:6px; font-size:0.75rem;" onclick="performDeactivateClub('${realClubId}')">Deactivate Profile</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (e) {
        console.error("My Enrolled Clubs rendering fault: ", e);
    }
}

async function performJoinClub(clubId) {
    const payload = {
        student_id: currentUserId,
        club_id: clubId,
        joined_date: new Date().toISOString().split('T')[0],
        active_status: "true"
    };
    try {
        const res = await fetch(`${BASE_URL}/api/v1/students_club/join`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok) showToast("Successfully integrated into the club registry! 🚀");
        else showToast("Failed registration sequence.");
    } catch (e) { console.error(e); }
}

async function performLeaveClub(clubId) {
    if (!confirm("Are you sure you want to leave this club?")) return;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/students_club/leave`, {
            method: 'POST', 
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clubId: clubId })
        });

        if (response.ok) {
            alert("Successfully left the club.");
            fetchAllCampusClubs();
            fetchMyEnrolledClubs();
        } else {
            const err = await response.json().catch(() => ({}));
            alert(`Failed: ${err.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Error leaving club:", error);
    }
}

async function performDeactivateClub(clubId) {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/students_club/${currentUserId}/${clubId}/deactivate`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
        if (res.ok) showToast("Active membership history flagged as 'False' successfully!");
        else showToast("Failed membership update validation.");
    } catch (e) { console.error(e); }
}


async function loadMyProfileAndDepartments() {

    try {
        const res = await fetch(`${BASE_URL}/api/v1/students/me`, { headers: getAuthHeaders() });
        if (res.ok) {
            const student = await res.json();
            
            document.getElementById('prof-fname').value = student.first_name || '';
            document.getElementById('prof-lname').value = student.last_name || '';
            document.getElementById('prof-email').value = student.email || '';
            document.getElementById('prof-phone').value = student.phone || '';
            document.getElementById('prof-year').value = student.enrolled_Year || student.enrolledYear || '';
            document.getElementById('prof-dept').value =  student.department_id || student.departmentId || '';
        

            const greetingPlaceholder = document.getElementById('user-display');
            if (greetingPlaceholder) {
                const studentName = student.first_name || "Student";
                const checkSignupFlag = sessionStorage.getItem('isNewSignup');

                if (checkSignupFlag === 'true') {
                    greetingPlaceholder.parentElement.innerHTML = `Welcome, <span id="user-display">${studentName}</span>! 🎓`;
                } else {
                    greetingPlaceholder.parentElement.innerHTML = `Welcome back, <span id="user-display">${studentName}</span>! 🎓`;
                }
            }

            if (student.profilePictureUrl || student.imageUrl) {
                document.getElementById('profile-pic-preview').src = student.profilePictureUrl || student.imageUrl;
            }
        }
    } catch (e) { console.error(e); }
}

async function saveDepartment() {
    const deptIdInput = document.getElementById('dept-id');
    const deptNameInput = document.getElementById('dept-name');

    if (!deptIdInput || !deptNameInput) {
        console.error("Could not find the department input elements in the DOM.");
        return;
    }

    const department_id = deptIdInput.value.trim();
    const department_name = deptNameInput.value.trim();


    if (!department_id || !department_name) {
        showToast("Please fill out both Department ID and Department Name!");
        return;
    }

    const payload = {
        department_id: department_id,
        department_name: department_name
    };

    try {

        const response = await fetch(`${BASE_URL}/api/v1/departments`, {
            method: 'POST',
            headers: getAuthHeaders(), 
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 201) {
            showToast("Department successfully saved! 🎉");
            
            deptIdInput.value = '';
            deptNameInput.value = '';
            
            if (typeof loadDepartments === 'function') loadDepartments(); 
        } else {
            const errText = await response.text();
            showToast(`Failed to save department: ${errText}`);
        }
    } catch (error) {
        console.error("Error saving department:", error);
        showToast("Network error while trying to register department.");
    }
}

async function updateDepartment() {
    const deptIdInput = document.getElementById('dept-id');
    const deptNameInput = document.getElementById('dept-name');

    if (!deptIdInput || !deptNameInput) {
        console.error("Could not find the department input elements.");
        return;
    }

    const department_id = deptIdInput.value.trim();
    const department_name = deptNameInput.value.trim();

    if (!department_id || !department_name) {
        showToast("Please provide both the Department ID and the new Department Name to update!");
        return;
    }
    const payload = {
        department_id: department_id,
        department_name: department_name
    };

    try {
        const response = await fetch(`${BASE_URL}/api/v1/departments`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 200) {
            showToast("Department successfully updated! 🔄");

            deptIdInput.value = '';
            deptNameInput.value = '';
            
            if (typeof loadDepartments === 'function') loadDepartments(); 
        } else {
            const errText = await response.text();
            showToast(`Update rejected by server: ${errText}`);
        }
    } catch (error) {
        console.error("Error updating department:", error);
        showToast("Network fault while trying to update department resource.");
    }
}


async function loadDepartments() {
    const tableBody = document.getElementById('department-table-body');
    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/departments`, {
            method: 'GET',
            headers: getAuthHeaders() 
        });

        if (!response.ok) {
            throw new Error(`Server returned status code: ${response.status}`);
        }

        const departments = await response.json();

        tableBody.innerHTML = '';

        if (departments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 20px; color: #64748b;">
                        No registered departments found.
                    </td>
                </tr>`;
            return;
        }

        departments.forEach(dept => {
            const row = document.createElement('tr');
            row.style.borderBottom = "1px solid #e2e8f0";

            row.innerHTML = `
                <td style="padding: 12px; font-family: monospace; font-weight: bold; color: #334155;">
                    ${dept.department_id}
                </td>
                <td style="padding: 12px; color: #334155;">
                    ${dept.department_name}
                </td>
                <td style="padding: 12px; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="btn btn-sm btn-outline" onclick="populateFormForEdit('${dept.department_id}', '${dept.department_name}')" style="padding: 4px 8px; font-size: 0.8rem; cursor: pointer;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading campus tracks registry:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 20px; color: #ef4444; font-weight: 500;">
                    <i class="fas fa-exclamation-triangle"></i> Failed to pull tracks data pipeline.
                </td>
            </tr>`;
    }
}


function populateFormForEdit(department_id, department_name) {
    const deptIdInput = document.getElementById('dept-id');
    const deptNameInput = document.getElementById('dept-name');
    
    if (deptIdInput && deptNameInput) {
        deptIdInput.value = department_id;
        deptNameInput.value = department_name;
        showToast(`Selected ${id} for layout update context.`);
    }
}

async function updateMyProfileDetails() {
    const payload = {
        firstName: document.getElementById('prof-fname').value.trim(),
        lastName: document.getElementById('prof-lname').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        enrolled_Year: parseInt(document.getElementById('prof-year').value),
        department_id: document.getElementById('prof-dept').value
    };
    try {
        const res = await fetch(`${BASE_URL}/api/v1/students/me`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok) showToast("Profile variables successfully committed to live clusters! Update clean.");
        else showToast("Information update refused.");
    } catch (e) { console.error(e); }
}


async function handleProfileImageUpload(event) {
    console.log("Profile upload fired.");
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgPreview = document.getElementById('profile-pic-preview');

            if (imgPreview) {
                imgPreview.src = e.target.result;
                
                if (typeof showToast === "function") {
                    showToast("Profile image loaded successfully!", "success");
                }
            }
        };
        reader.readAsDataURL(file);
    }
}




async function fetchAllUpcomingEvents() {
    const grid = document.getElementById('events-listing-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/events`, { headers: getAuthHeaders() });
        if (res.ok) {
            const events = await res.json();
            grid.innerHTML = events.map(ev => `
                <div class="card" style="border-top: 4px solid var(--cinec-sky); padding: 15px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <!-- Event Title -->
                        <h4 style="color: var(--cinec-navy); margin: 0 0 8px 0; font-size: 1.1rem;">
                            ${ev.eventTitle || 'Untitled Event'}
                        </h4>
                        
                        <!-- Hosted By (Club Name) -->
                        <p style="font-size: 0.85rem; margin: 4px 0; color: var(--text-muted);">
                            <strong>Hosted by:</strong> ${ev.club_name || 'Campus Club'}
                        </p>
                        
                        <!-- Venue/Location -->
                        <p style="font-size: 0.85rem; margin: 4px 0; color: #4a5568;">
                            <i class="fas fa-map-marker-alt" style="color: #e63946; margin-right: 4px;"></i> 
                            Venue: ${ev.location_name || 'Main Campus'}
                        </p>
                    </div>
                    
                    <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #edf2f7;">
                        <!-- Date and Time Tracking -->
                        <small style="color: var(--cinec-sky); font-weight: bold; display: block; margin-bottom: 2px;">
                            <i class="fas fa-calendar-day"></i> Date: ${ev.event_date || 'N/A'}
                        </small>
                        <small style="color: var(--text-muted); font-weight: 500;">
                            <i class="fas fa-clock"></i> Time: ${ev.event_time || 'N/A'}
                        </small>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) { 
        console.error("Events collection fault:", e); 
    }
}


async function fetchAllLocationsAndStatuses() {
    const grid = document.getElementById('locations-operational-grid');
    if (!grid) return;

    try {
        // Parallel cluster structural fetch sequencing pipeline requests
        const [locRes, statRes] = await Promise.all([
            fetch(`${BASE_URL}/api/v1/locations`, { method: 'GET', headers: getAuthHeaders() }),
            fetch(`${BASE_URL}/api/v1/locations/all-status`, { method: 'GET', headers: getAuthHeaders() })
        ]);

        if (locRes.ok && statRes.ok) {
            const locations = await locRes.json();
            const liveStatuses = await statRes.json();

            grid.innerHTML = locations.map(loc => {
                const id = loc.locationId || loc.location_id || 'N/A';
                const name = loc.locationName || loc.location_name || 'Unknown Landmark Node';
                const capacity = loc.capacity || 0;
                
                const status = liveStatuses[id] || "EMPTY";

                let statusColor = "#2ec4b6"; 
                if (status === "MODERATE") statusColor = "#b45309"; 
                if (status === "CROWDED") statusColor = "#e63946";  

                return `
                    <div class="card" style="border-left: 5px solid var(--cinec-sky); padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <!-- Header node with Location metadata definitions tags -->
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <h4 style="color: var(--cinec-navy); margin: 0; font-size: 1.1rem;">
                                    <i class="fas fa-building"></i> ${name}
                                </h4>
                                <span style="background: ${statusColor}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; letter-spacing: 0.5px;">
                                    ${status}
                                </span>
                            </div>
                            
                            <!-- Primary descriptive definitions properties metrics blocks elements -->
                            <p style="font-size: 0.9rem; margin: 6px 0; color: #475569;">
                                <strong>Structural Identity Key:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${id}</code>
                            </p>
                            <p style="font-size: 0.9rem; margin: 6px 0; color: #475569;">
                                <strong>Maximum Permitted Capacity:</strong> ${capacity} spaces max
                            </p>
                        </div>
                        
                        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 12px 0 10px 0;">
                        
                        <!-- Real-time structural node monitoring indicators subtext status alignment wrapper -->
                        <div style="display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.8rem;">
                            <i class="fas fa-circle-notch fa-spin" style="color: ${statusColor};"></i>
                            <span>Live terminal monitoring feed synchronized active</span>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            console.error("Facility monitoring components pipeline refused request profiles compilation parameters configuration framework logs alignment indexes.");
            grid.innerHTML = `<p style="color: var(--danger); font-size: 0.9rem;">Operational metrics synchronization error.</p>`;
        }
    } catch (e) {
        console.error("Network interface error in facility telemetry parameters configuration maps matrix:", e);
        grid.innerHTML = `<p style="color: var(--danger); font-size: 0.9rem;">Cluster connection lost. Offline tracking error structural breakdown.</p>`;
    }
}

async function querySpecificLocationInfo() {
    const locId = document.getElementById('search-location-id').value.trim();
    const reportBox = document.getElementById('location-inspection-report');
    if (!locId || !reportBox) return;

    try {
        const infoRes = await fetch(`${BASE_URL}/api/v1/locations/${locId}`, { headers: getAuthHeaders() });
        const statusRes = await fetch(`${BASE_URL}/api/v1/locations/${locId}/status`, { headers: getAuthHeaders() });
        
        if (infoRes.ok && statusRes.ok) {
            const info = await infoRes.json();
            
            const statusData = await statusRes.json(); 
            const liveStatus = statusData.status || "N/A";

            const locationName = info.location_name || info.name || info.id || "Unknown";
            const locationDesc = info.capacity || info.zoneDescription || "No description provided.";

            reportBox.style.display = 'block';
            reportBox.innerHTML = `
                <h5>Location Name: ${locationName}</h5>
                <p style="font-size:0.85rem; margin-top:5px;"><strong>Capacity:</strong> ${locationDesc}</p>
                <p style="font-size:0.85rem;"><strong>Live Status:</strong> ${liveStatus}</p>
            `;
        } else {
            showToast("Could not find matching location.");
        }
    } catch (e) { 
        console.error(e); 
    }
}


async function toggleDirectoryMode(mode) {
    const grid = document.getElementById('directory-content-cards');
    const heading = document.getElementById('directory-heading-text');
    const stuBtn = document.getElementById('toggle-student-dir-btn');
    const stfBtn = document.getElementById('toggle-staff-dir-btn');
    if (!grid) return;

    if (mode === 'STUDENTS') {
        stuBtn.className = "btn btn-primary"; stfBtn.className = "btn btn-outline";
        heading.innerText = "Registered Student Scholars Global List";
        try {
            const res = await fetch(`${BASE_URL}/api/v1/students`, { headers: getAuthHeaders() });
            if (res.ok) {
                const students = await res.json();
                grid.innerHTML = students.map(s => {
                    const firstName = s.firstName || s.first_name || '';
                    const lastName = s.lastName || s.last_name || '';
                    const studentId = s.id || s.userId || s.student_id || 'Student';
                    
                    return `
                        <div class="card" style="text-align:center;">
                            <i class="fas fa-user-grad" style="font-size:2rem; color:var(--cinec-navy);"></i>
                            <h5 style="margin-top:10px;">${firstName} ${lastName}</h5>
                            <small style="color:var(--text-muted);">${studentId}</small>
                        </div>
                    `;
                }).join('');
            }
        } catch (e) { console.error(e); }
    } else {
        stfBtn.className = "btn btn-primary"; stuBtn.className = "btn btn-outline";
        heading.innerText = "Academic & Administrative Officers Panel";
        try {
            const res = await fetch(`${BASE_URL}/api/v1/staff`, { headers: getAuthHeaders() });
            if (res.ok) {
                const staff = await res.json();
                grid.innerHTML = staff.map(s => {
                    const firstName = s.firstName || s.first_name || '';
                    const lastName = s.lastName || s.last_name || '';
                    
                    return `
                        <div class="card" style="text-align:center;">
                            <i class="fas fa-user-tie" style="font-size:2rem; color:var(--cinec-sky);"></i>
                            <h5 style="margin-top:10px;">${firstName} ${lastName}</h5>
                            <small style="color:var(--text-muted);">${s.email || 'Staff Core'}</small>
                        </div>
                    `;
                }).join('');
            }
        } catch (e) { console.error(e); }
    }
}



async function fetchMyEarnedRewards() {
    const grid = document.getElementById('rewards-tokens-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/student_rewards/my-rewards`, { headers: getAuthHeaders() });
        if (res.ok) {
            const rewards = await res.json();
            grid.innerHTML = rewards.map(rw => `
                <div class="card" style="text-align:center; background: #fffdf5; border: 1px solid #fef08a;">
                    <i class="fas fa-trophy" style="font-size:2.5rem; color:#eab308; margin-bottom:10px;"></i>
                    <h4 style="color:var(--cinec-navy);">${rw.title || rw.rewardName || 'Token Bundle'}</h4>
                    <p style="font-size:1.5rem; font-weight:bold; color:#ca8a04; margin:5px 0;">${rw.points || rw.tokenBalance || 0} Pts</p>
                    <small style="color:var(--text-muted);">Unlocked via campus activities</small>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}


async function saveStudent() {
    const student_id = document.getElementById('stu-id')?.value.trim();
    const first_name = document.getElementById('stu-fname')?.value.trim();
    const last_name = document.getElementById('stu-lname')?.value.trim();
    const student_pwd = document.getElementById('stu-password')?.value.trim();
    const email = document.getElementById('stu-email')?.value.trim();
    const phone = document.getElementById('stu-phone')?.value.trim();
    const enrolled_Year = document.getElementById('stu-year')?.value.trim();
    const department_id = document.getElementById('stu-dept')?.value.trim();

    if (!student_id || !first_name || !last_name || !student_pwd || !department_id) {
        showToast("Please fulfill all required fields (ID, Names, Password, Dept)!");
        return;
    }

    const payload = {
        student_id: student_id,
        first_name: first_name,
        last_name: last_name,
        student_pwd: student_pwd,
        email: email || "",
        phone: phone || "",
        enrolled_Year: parseInt(enrolled_Year) || 2026,
        department_id: department_id
    };

    try {
        const res = await fetch(`${BASE_URL}/api/v1/students`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 201) {
            showToast("Student entry successfully recorded! 🚀");
            loadUserManagementTabs();
            refreshOverviewMetrics();
        } else {
            const errorDetails = await res.text();
            showToast(`Server rejected request: ${errorDetails}`);
        }
    } catch (e) {
        console.error(e);
        showToast("Network fault writing single student schema.");
    }
}

async function triggerSampleBatchPayload() {
    const batchPayload = [
        {
            student_id: "STU_B01",
            first_name: "Kasun",
            last_name: "Perera",
            student_pwd: "@Kasun123",
            email: "kasun@cinec.edu",
            enrolled_Year: 2026,
            department_id: "COM_01"
        },
        {
            student_id: "STU_B02",
            first_name: "Dilini",
            last_name: "Fernando",
            student_pwd: "@Dilini123",
            email: "dilini@cinec.edu",
            enrolled_Year: 2026,
            department_id: "COM_01"
        }
    ];

    try {
        const response = await fetch(`${BASE_URL}/api/v1/students/save-students`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(batchPayload)
        });

        if (response.ok || response.status === 200 || response.status === 201) {
            showToast("Multiple student batch successfully ingested! 🚀");
            loadUserManagementTabs();
            refreshOverviewMetrics();
        } else {
            const errText = await response.text();
            showToast(`Batch Ingestion Failed: ${errText}`);
        }
    } catch (err) {
        console.error("Batch framework processing error context:", err);
        showToast("Network failure addressing multi-student registration route.");
    }
}

function openBatchIngestionModal() {
    let modal = document.getElementById('batch-ingestion-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'batch-ingestion-modal';
        modal.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; 
            justify-content: center; z-index: 9999; backdrop-filter: blur(4px);
        `;
        
        modal.innerHTML = `
            <div style="background: #ffffff; width: 600px; padding: 25px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="color: var(--cinec-navy, #1e3a8a); margin: 0;"><i class="fas fa-users-cog"></i> Multiple Batch Ingestion Matrix</h3>
                    <button onclick="closeBatchIngestionModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
                </div>
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 15px;">
                    Paste a valid JSON array of structured student entities matching your database schemas variables below:
                </p>
                <textarea id="batch-students-json" style="width: 100%; height: 250px; font-family: monospace; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical;" 
                    placeholder='[\n  {\n    "student_id": "STU101",\n    "first_name": "John",\n    "last_name": "Doe",\n    "student_pwd": "SecurePassword123",\n    "department_id": "CS"\n  }\n]'></textarea>
                <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="btn btn-outline" onclick="closeBatchIngestionModal()" style="padding: 8px 16px;">Cancel</button>
                    <button class="btn btn-primary" onclick="executeBatchIngestionProcess()" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">Execute Cluster Ingestion</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
}



function closeBatchIngestionModal() {
    const modal = document.getElementById('batch-ingestion-modal');
    if (modal) modal.style.display = 'none';
}

async function executeBatchIngestionProcess() {
    const rawDataText = document.getElementById('batch-students-json')?.value.trim();
    if (!rawDataText) return alert("Ingestion workspace target parameters blank!");

    let studentArray = [];
    try {
        studentArray = JSON.parse(rawDataText);
        if (!Array.isArray(studentArray)) throw new Error("Parsed root structural node data metadata is not an array index.");
    } catch (parseError) {
        return alert(`Failed validation processing text data array matrix sequence: ${parseError.message}`);
    }

    let successCounter = 0;
    let failureCounter = 0;

    showToast(`Beginning process cluster iteration mapping onto: ${studentArray.length} nodes...`);


    for (const student of studentArray) {
        try {
            const processedPayload = {
                student_id: student.student_id || student.studentId,
                first_name: student.first_name || student.firstName,
                last_name: student.last_name || student.lastName,
                student_pwd: student.student_pwd || student.studentPwd || student.password,
                email: student.email || "",
                phone: student.phone || "",
                enrolled_Year: parseInt(student.enrolled_Year || student.enrolledYear) || 2026,
                department_id: student.department_id || student.departmentId
            };

            const response = await fetch(`${BASE_URL}/api/v1/students`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(processedPayload)
            });

            if (response.ok || response.status === 201) successCounter++;
            else failureCounter++;
        } catch (err) {
            console.error("Cluster record drop sequence initialization block fail tracking layout error:", err);
            failureCounter++;
        }
    }

    alert(`Ingestion Pipeline Completed Task Session.\n\nSuccessfully Built: ${successCounter} accounts.\nFailed Ingestion drops: ${failureCounter}.`);
    closeBatchIngestionModal();
    loadUserManagementTabs();
    refreshOverviewMetrics();
}

function logoutProcess() {
    localStorage.clear();
    window.location.href = "login.html";
}



function toggleChatbotOverlayWindow() {
    const chatWin = document.getElementById('chatbot-window-panel');
    if (chatWin) {
        const currentlyVisible = chatWin.style.display === 'flex';
        chatWin.style.display = currentlyVisible ? 'none' : 'flex';
    }
}

async function dispatchChatbotQueryMessage() {
    const inputField = document.getElementById('chat-query-input');
    const msgContainer = document.getElementById('chat-messages-container');
    if (!inputField || !msgContainer || !inputField.value.trim()) return;

    const userMessage = inputField.value.trim();
    

    msgContainer.innerHTML += `<div class="chat-bubble user">${userMessage}</div>`;
    inputField.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    const loaderId = 'bot-loading-stub';
    msgContainer.innerHTML += `<div class="chat-bubble bot" id="${loaderId}"><i class="fas fa-ellipsis-h fa-spin"></i> Thinking...</div>`;
    msgContainer.scrollTop = msgContainer.scrollHeight;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/chatbot/query`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ query: userMessage })
        });


        document.getElementById(loaderId)?.remove();

        if (response.ok) {
            const data = await response.json();
            const replyText = data.reply || data.response || "I processed your request successfully, bro!";
            msgContainer.innerHTML += `<div class="chat-bubble bot">${replyText}</div>`;
        } else {
            msgContainer.innerHTML += `<div class="chat-bubble bot" style="color:var(--danger);">Sorry, I'm having trouble connecting to the core server gateway right now.</div>`;
        }
    } catch (err) {
        document.getElementById(loaderId)?.remove();
        console.error("Chatbot response sequence execution fail tracking:", err);
        msgContainer.innerHTML += `<div class="chat-bubble bot" style="color:var(--danger);">Connection lost. Verify your backend server is up on port 8081, bro!</div>`;
    }
    msgContainer.scrollTop = msgContainer.scrollHeight;
}
