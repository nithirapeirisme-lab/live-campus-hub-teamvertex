function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function switchTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = 'block';
    btn.classList.add('active');
}

function loginProcess() {
    const nameInput = document.getElementById('student-name').value;
    if(nameInput.trim() !== "") {
        document.getElementById('user-display').innerText = nameInput;
        showView('dashboard-view');
    } else {
        alert("Please enter your Student ID");
    }
}