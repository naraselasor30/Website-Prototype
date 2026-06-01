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
async function handleLogin() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            window.location.href = "Home.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to server.");

    }
}

// Function para i-check kung naka-login na


function loadProfile() {
    const username = localStorage.getItem('username');

    if (username) {
        document.getElementById('usernameDisplay').innerText = "Hi, " + username + "!";
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('currentUser');

    window.location.href = "Home.html";
}

function handleRegister() {
    const firstName = document.getElementById("regFirstName").value;
    const lastName = document.getElementById("regLastName").value;
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("termsCheck").checked;

    // REQUIRED
    if (!firstName || !lastName || !username || !password || !confirmPassword) {
        alert("Please fill all fields!");
        return;
    }

    // TERMS
    if (!terms) {
        alert("You must agree to the Terms and Privacy Policy!");
        return;
    }

    // MATCH
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // LENGTH
    if (password.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    // RULES
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;

    if (!passwordRegex.test(password)) {
        alert("Password must:\n- Have 1 uppercase\n- Have 1 number\n- No special characters");
        return;
    }

fetch("http://127.0.0.1:5000/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        firstName,
        lastName,
        username,
        password
    })
})
.then(res => res.json())
.then(data => {

    if (data.success) {

        alert("Account created successfully!");

    } else {

        alert(data.message);

    }

})
.catch(error => {

    console.error(error);

    alert("Cannot connect to server.");

});
}

async function openLegal(file) {
    const response = await fetch(file);
    const data = await response.json();

    document.getElementById("modalTitle").innerText = data.title;
    document.getElementById("modalText").innerText = data.content;

    document.getElementById("legalModal").style.display = "block";
}

function closeLegalModal() {
    document.getElementById("legalModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {

    const authLink = document.getElementById("authLink");

    if (!authLink) return;

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {

        authLink.innerHTML = `
            <div class="profile-menu-wrapper">
                <button class="btn-signin" onclick="toggleProfileMenu()">
                    <i class="fa-solid fa-circle-user"></i> Profile
                </button>

                <div id="profileDropdown" class="profile-dropdown">
                    <p onclick="openProfilePage()">👤 Account Info</p>
                    <p onclick="openSettingsModal()">⚙ Settings</p>
                    <p onclick="toggleDarkMode()">🌙 Dark / Light Mode</p>
                    <p onclick="logout()">🚪 Log Out</p>
                </div>
            </div>
        `;

    } else {

        authLink.innerHTML = `
            <a href="Login.html">
                <button class="btn-signin">
                    <i class="fa-solid fa-user"></i> Sign In
                </button>
            </a>
        `;
    }

});


// ================= LESSON SYSTEM (Database / JSON-BASED) =================



// Start lesson
async function startLesson(topic) {

    document.getElementById("lessonList").style.display = "block";

    document.getElementById("courseTitle").innerText =
        topic + " Lessons";

    const lessonButtons =
        document.getElementById("lessonButtons");

    lessonButtons.innerHTML = "";

    const response = await fetch(
        `http://127.0.0.1:5000/lessons/${topic}`
    );

    const lessons = await response.json();

    lessons.forEach((lesson) => {

        const btn =
            document.createElement("button");

        btn.className = "btn-quiz-outline learn-topic-btn";

        btn.innerText =
            lesson.title;

        btn.onclick = () => {

            document
                .querySelectorAll(".learn-topic-btn")
                .forEach(button => {
                    button.classList.remove("learn-topic-active");
                });

            btn.classList.add("learn-topic-active");

            openLesson(lesson);
        };

        lessonButtons.appendChild(btn);

    });
}

async function openLesson(lesson) {

    console.log("OPEN LESSON CLICKED");
    console.log(lesson);

    try {

        const filePath =
            "../Data/Lesson/" + lesson.file;

        console.log("Loading:", filePath);

        const response =
            await fetch(filePath);

        console.log("Response:", response.status);

        const data =
            await response.json();

        console.log(data);

        document.getElementById("lessonContent").style.display =
            "block";

        document.getElementById("lessonTitle").innerText =
            data.title;

        document.getElementById("lessonDescription").innerHTML =
            data.description
                .map(text =>
                    `<p>${
                        text
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                    }</p>`
                )
                .join("");

        document.getElementById("lessonCode").innerText =
            data.example.code;

        document.getElementById("lessonOutput").innerText =
            data.example.output;

    } catch(error) {

        console.error("LESSON ERROR:", error);

    }

    document.getElementById("lessonContent")
    .scrollIntoView({
        behavior: "smooth"
    });
}

// Complete lesson (progress system)
async function completeLesson() {

    const user =
        JSON.parse(localStorage.getItem("currentUser"));

    const lessonName =
        document.getElementById("lessonTitle").innerText;

    const response = await fetch(
        "http://127.0.0.1:5000/complete_lesson",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                lessonName: lessonName
            })
        }
    );

    const data = await response.json();

    if (data.success) {
        alert("Lesson completed!");
    }
}
// ================= MODERN QUIZ SYSTEM (THESIS VERSION) =================

let quizData = {};
let currentQuestionIndex = 0;
let score = 0;
let currentQuiz = "";
let answered = false;

// ================= LOAD QUIZ DATA =================
async function loadQuizData() {
    try {
        const res = await fetch('../Data/Quiz/quizData.json');
        quizData = await res.json();
    } catch (error) {
        console.error("Error loading quiz data:", error);
    }
}
loadQuizData();

// ================= START QUIZ =================
function startQuiz(topic) {
    if (!quizData || Object.keys(quizData).length === 0) {
        alert("Quiz still loading, please wait...");
        return;
    }

    if (!quizData[topic]) {
        alert("Quiz not found.");
        return;
    }

    currentQuiz = topic;
    currentQuestionIndex = 0;
    score = 0;

    loadQuestion();
}
// ================= LOAD QUESTION =================
function loadQuestion() {
    answered = false;

    const q = quizData[currentQuiz]?.[currentQuestionIndex];

    if (!q) {
        console.error("Question undefined:", currentQuiz, currentQuestionIndex);
        return;
    }

    // Question
    document.getElementById('quizQuestion').innerText = q.question;

    // Progress
    document.getElementById('quizProgress').innerText =
        `Question ${currentQuestionIndex + 1} / ${quizData[currentQuiz].length}`;

    // Reset Next button (IMPORTANT)
    document.getElementById('nextBtn').disabled = true;

    // Choices
    const container = document.getElementById('quizChoices');
    container.innerHTML = "";

    q.choices.forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.className = "btn-quiz-outline learn-topic-btn";
        btn.innerText = choice;

        btn.onclick = () => checkAnswer(index, btn);

        container.appendChild(btn);
    });
}

// ================= CHECK ANSWER =================
function checkAnswer(selected, btn) {
    if (answered) return; // prevent double click

    answered = true;

    const correct = quizData[currentQuiz][currentQuestionIndex].answer;
    const buttons = document.querySelectorAll('#quizChoices button');

    // Disable all buttons
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        score++;
        btn.classList.add("correct");
    } else {
        btn.classList.add("wrong");
        buttons[correct].classList.add("correct");
    }

    // 🔥 ENABLE NEXT BUTTON
    document.getElementById('nextBtn').disabled = false;
}

// ================= NEXT QUESTION =================
function nextQuestion() {
    if (!currentQuiz) return;

    currentQuestionIndex++;

    if (currentQuestionIndex >= quizData[currentQuiz].length) {
        showResult();
        return;
    }

    loadQuestion();
}

// ================= RESULT SCREEN =================
function showResult() {
    const total = quizData[currentQuiz].length;

    document.getElementById('quizQuestion').innerText = `🎉 Quiz Completed!`;
    document.getElementById('quizProgress').innerText = `Score: ${score} / ${total}`;

    document.getElementById('quizChoices').innerHTML = `
        <p style="font-size:1.2rem; margin-top:20px;">
            You got ${score} out of ${total} questions correct.
        </p>
    `;

    // Disable next after finish
    document.getElementById('nextBtn').disabled = true;

    // Save score
    localStorage.setItem(`quizScore_${currentQuiz}`, score);
}

// ================= SELECT QUIZ (UI) =================
function selectQuiz(element, topic) {
    document.querySelectorAll('.quiz-option').forEach(el => {
        el.classList.remove('active');
    });

    element.classList.add('active');
    startQuiz(topic);
}

// ================= PROFILE DROPDOWN =================

function toggleProfileMenu() {
    const menu = document.getElementById("profileDropdown");

    if (!menu) return;

    menu.style.display =
        menu.style.display === "block" ? "none" : "block";
}

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
    const wrapper = document.querySelector(".profile-menu-wrapper");

    if (wrapper && !wrapper.contains(event.target)) {
        const menu = document.getElementById("profileDropdown");
        if (menu) menu.style.display = "none";
    }
});

function openProfilePage() {
    window.location.href = "../Pages/Profile.html";
}

// ================= DARK MODE =================

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save mode
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Load saved theme
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
});