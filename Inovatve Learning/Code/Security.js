// Function para buksan ang modal
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

// Function para isara ang modal
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// Isara ang modal kapag pinindot ang labas ng box
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
}

// Logic para sa Language Switch
function changeLang(lang) {
    document.getElementById('currentLang').innerText = lang;
    if(lang === 'Tagalog') {
        alert("Wika ay pinalitan sa Tagalog");
        // Dito mo pwedeng palitan ang text ng buong page sa future
    }
    closeModal('langModal');
}

document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        // Hanapin ang katabing input field
        const passwordInput = this.previousElementSibling;
        
        // Pagpapalit ng type (password <-> text)
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash'); // Magpapalit ng icon na may slash
        } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// Function para sa Login (ilalagay sa onclick ng button sa Login.html)
function handleLogin() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = "Home.html";
}

// Function para i-check kung naka-login na
function checkAuthStatus() {
    const authButton = document.getElementById('authButton');
    const authLink = document.getElementById('authLink');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        if (authButton) {
            // Papalitan ang text sa loob ng button
            authButton.innerHTML = '<i class="fa-solid fa-circle-user"></i> Profile';
        }
        if (authLink) {
            // Papalitan ang link para sa Profile page na ang punta
            authLink.href = "Profile.html";
        }
    }
}

// Patakbuhin tuwing mag-load ang page
window.onload = checkAuthStatus;