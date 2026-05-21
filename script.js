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
        loadFacilityLocations();
        loadRewardsCatalog();
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
    const id = document.getElementById('club-id-input').value.trim();
    const name = document.getElementById('club-name-input').value.trim();
    const desc = document.getElementById('club-desc-input').value.trim();

    if (!id || !name) { return alert("Please fill out Club ID and Title, bro!"); }

    const payload = { club_id: id, club_name: name, description: desc };

    try {
        const res = await fetch(`${BASE_URL}/api/v1/clubs`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok || res.status === 201) {
            showToast("Club saved successfully!");
            document.getElementById('club-id-input').value = '';
            document.getElementById('club-name-input').value = '';
            document.getElementById('club-desc-input').value = '';
            loadClubs();
        }
    } catch (e) { console.error(e); }
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
                const title = evt.title || evt.event_title || evt.eventName || evt.event_name || 'Untitled Event';
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
    const id = document.getElementById('event-id').value.trim();
    const title = document.getElementById('event-title').value.trim();
    const desc = document.getElementById('event-desc').value.trim();
    const date = document.getElementById('event-date').value;
    

    const time = document.getElementById('event-time')?.value || ''; 
    const club = document.getElementById('event-club')?.value || '';
    const loc = document.getElementById('event-location').value.trim();

    if (!id || !title) return alert("Fill in Event ID and Title!");

    const payload = { 
        event_id: id, 
        title: title, 
        description: desc, 
        date: date,
        event_time: time,
        club_name: club,
        location_id: loc 
    };

    try {
        const res = await fetch(`${BASE_URL}/api/v1/events`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok || res.status === 201) {
            showToast("Event successfully logged.");
            document.getElementById('event-id').value = '';
            document.getElementById('event-title').value = '';
            document.getElementById('event-desc').value = '';
            document.getElementById('event-date').value = '';
            if(document.getElementById('event-time')) document.getElementById('event-time').value = '';
            if(document.getElementById('event-club')) document.getElementById('event-club').value = '';
            document.getElementById('event-location').value = '';
            loadEvents();
        }
    } catch (e) { console.error(e); }
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
                const points = rew.pointsRequired || rew.points_required || 0;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${id}</strong></td>
                    <td>${name}</td>
                    <td><span style="color:var(--cinec-sky); font-weight:700;">${points} pts</span></td>
                    <td class="center-text">
                        <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;" onclick="deleteRewardObj('${id}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) { console.error(e); }
}

async function saveRewardListing() {
    const id = document.getElementById('reward-id').value.trim();
    const title = document.getElementById('reward-title').value.trim();
    const points = document.getElementById('reward-points').value.trim();

    if (!id || !title || !points) return alert("Fill out all Loyalty Reward variables!");

    const payload = { reward_id: id, reward_name: title, points_required: parseFloat(points) };

    try {
        const res = await fetch(`${BASE_URL}/api/v1/rewards`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok || res.status === 201) {
            showToast("Reward listing published.");
            document.getElementById('reward-id').value = '';
            document.getElementById('reward-title').value = '';
            document.getElementById('reward-points').value = '';
            loadRewardsCatalog();
        }
    } catch (e) { console.error(e); }
}

async function deleteRewardObj(id) {
    if (!confirm(`Purge Reward [${id}] from inventory listing?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/rewards/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok || res.status === 204) {
            showToast("Reward listing removed.");
            loadRewardsCatalog();
        }
    } catch (e) { console.error(e); }
}

async function loadTransitLogistics() {
    const tbody = document.getElementById('transit-table-body');
    if (!tbody) {
        console.warn("Could not find element ID: 'transit-table-body' in your HTML!");
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/api/v1/transit`, { 
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


async function handleProfileImageUpload() { console.log("Profile upload fired."); }
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
    if (targetTabId === 'tab-clubs') fetchAllCampusClubs();
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
            grid.innerHTML = data.map(bus => `
                <div class="card" style="border-left: 5px solid var(--cinec-sky);">
                    <h4 style="color: var(--cinec-navy);"><i class="fas fa-bus-alt"></i> ${bus.busRoute || bus.routeNumber || 'Transit Line'}</h4>
                    <p style="font-size:0.9rem; margin-top:5px;"><strong>Driver Name:</strong> ${bus.driverName || 'N/A'}</p>
                    <p style="font-size:0.85rem; color: var(--text-muted);">Capacity Load Count: ${bus.capacity || 'Standard'}</p>
                </div>
            `).join('');
        }
    } catch (e) { console.error("Transit collection fault:", e); }
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
                    <td style="padding: 10px; font-size: 0.9rem;">${log.id || 'N/A'}</td>
                    <td style="padding: 10px; font-weight: bold; color: var(--cinec-sky);">${log.locationId || log.nodeId || 'Campus Node'}</td>
                    <td style="padding: 10px; font-size: 0.85rem; color: var(--text-muted);">${log.timestamp || log.checkTime || 'N/A'}</td>
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
            grid.innerHTML = clubs.map(club => `
                <div class="card" style="padding: 20px;">
                    <h4 style="color: var(--cinec-navy);"><i class="fas fa-flag"></i> ${club.name || club.clubName}</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin: 8px 0;">${club.description || 'No description summary available.'}</p>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
                        <button class="btn btn-primary" style="padding:6px; font-size:0.8rem;" onclick="performJoinClub('${club.id}')">Join Association</button>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-outline" style="flex:1; padding:4px; font-size:0.75rem; color:var(--danger); border-color:var(--danger);" onclick="performLeaveClub('${club.id}')">Leave (Purge)</button>
                            <button class="btn btn-outline" style="flex:1; padding:4px; font-size:0.75rem;" onclick="performDeactivateClub('${club.id}')">Deactivate Profile</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
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
    const payload = { joined_date: null, active_status: null, student_id: currentUserId, club_id: clubId };
    try {
        const res = await fetch(`${BASE_URL}/api/v1/students_club/leave`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok) showToast("Club registry credentials successfully wiped clean! 🔍");
        else showToast("Action aborted by authentication pipeline.");
    } catch (e) { console.error(e); }
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
    const deptDropdown = document.getElementById('prof-dept');
    if (deptDropdown) {
        try {
            const deptRes = await fetch(`${BASE_URL}/api/v1/departments`, { headers: getAuthHeaders() });
            if (deptRes.ok) {
                const depts = await deptRes.json();
                deptDropdown.innerHTML = depts.map(d => `<option value="${d.id || d.departmentId}">${d.name || d.departmentName || d.id}</option>`).join('');
            }
        } catch (err) { console.error(err); }
    }

    try {
        const res = await fetch(`${BASE_URL}/api/v1/students/me`, { headers: getAuthHeaders() });
        if (res.ok) {
            const student = await res.json();
            
            document.getElementById('prof-fname').value = student.firstName || '';
            document.getElementById('prof-lname').value = student.lastName || '';
            document.getElementById('prof-email').value = student.email || '';
            document.getElementById('prof-phone').value = student.phone || '';
            document.getElementById('prof-year').value = student.enrolled_Year || student.enrolledYear || '';
            if (student.department_id || student.departmentId) {
                deptDropdown.value = student.department_id || student.departmentId;
            }


            const greetingPlaceholder = document.getElementById('user-display');
            if (greetingPlaceholder) {
                const studentName = student.firstName || "Student";
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
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(`${BASE_URL}/api/v1/students/profile/image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
            body: formData
        });
        if (res.ok) {
            showToast("Profile image uploaded successfully!");
            loadMyProfileAndDepartments();
        } else {
            showToast("Photo transfer denied.");
        }
    } catch (e) { console.error(e); }
}



async function fetchAllUpcomingEvents() {
    const grid = document.getElementById('events-listing-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/events`, { headers: getAuthHeaders() });
        if (res.ok) {
            const events = await res.json();
            grid.innerHTML = events.map(ev => `
                <div class="card">
                    <h4 style="color:var(--cinec-navy);">${ev.title || ev.eventName}</h4>
                    <p style="font-size:0.85rem; margin:6px 0;">${ev.description || 'N/A'}</p>
                    <small style="color:var(--cinec-sky); font-weight:bold;"><i class="fas fa-clock"></i> Scheduled: ${ev.date || ev.eventDate || 'N/A'}</small>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}


async function fetchAllLocationsAndStatuses() {
    const grid = document.getElementById('locations-operational-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/api/v1/locations/all-status`, { headers: getAuthHeaders() });
        if (res.ok) {
            const statuses = await res.json();
            grid.innerHTML = statuses.map(loc => `
                <div class="card" style="padding:15px; border-top: 4px solid var(--cinec-navy);">
                    <h5>${loc.locationName || loc.id}</h5>
                    <p style="font-size:0.8rem; margin:5px 0; color:var(--text-muted);">ID Code Block: ${loc.id}</p>
                    <span style="font-size:0.8rem; padding:3px 8px; border-radius:12px; background:${loc.status === 'OPEN' || loc.status === 'AVAILABLE' ? '#d1fae5; color:#065f46;' : '#fee2e2; color:#991b1b;'}">
                        ${loc.status || 'UNKNOWN'}
                    </span>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
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
            const statusStr = await statusRes.text();
            reportBox.style.display = 'block';
            reportBox.innerHTML = `
                <h5>Blueprint Report: ${info.name || info.id}</h5>
                <p style="font-size:0.85rem; margin-top:5px;"><strong>Zone Description:</strong> ${info.description || 'N/A'}</p>
                <p style="font-size:0.85rem;"><strong>Live Metric Capacity Level:</strong> ${statusStr || 'N/A'}</p>
            `;
        } else {
            showToast("Could not find matching location.");
        }
    } catch (e) { console.error(e); }
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
                grid.innerHTML = students.map(s => `
                    <div class="card" style="text-align:center;">
                        <i class="fas fa-user-grad" style="font-size:2rem; color:var(--cinec-navy);"></i>
                        <h5 style="margin-top:10px;">${s.firstName} ${s.lastName}</h5>
                        <small style="color:var(--text-muted);">${s.id || s.userId || 'Student'}</small>
                    </div>
                `).join('');
            }
        } catch (e) { console.error(e); }
    } else {
        stfBtn.className = "btn btn-primary"; stuBtn.className = "btn btn-outline";
        heading.innerText = "Academic & Administrative Officers Panel";
        try {
            const res = await fetch(`${BASE_URL}/api/v1/staff`, { headers: getAuthHeaders() });
            if (res.ok) {
                const staff = await res.json();
                grid.innerHTML = staff.map(s => `
                    <div class="card" style="text-align:center;">
                        <i class="fas fa-user-tie" style="font-size:2rem; color:var(--cinec-sky);"></i>
                        <h5 style="margin-top:10px;">${s.firstName} ${s.lastName}</h5>
                        <small style="color:var(--text-muted);">${s.email || 'Staff Core'}</small>
                    </div>
                `).join('');
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

function logoutProcess() {
    localStorage.clear();
    window.location.href = "login.html";
}
