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
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(user =>
        user.username === username && user.password === password
    );

    if (foundUser) {
        localStorage.setItem('isLoggedIn', 'true');

        // 🔥 SAVE FULL USER DATA
        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        // Optional fallback
        localStorage.setItem('username', foundUser.username);

        window.location.href = "Home.html";
    } else {
        alert("Invalid username or password!");
    }
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
window.addEventListener("load", () => {
    checkAuthStatus();
});


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

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.username === username);

    if (exists) {
        alert("Username already exists!");
        return;
    }

    // 🔥 SAVE FULL DATA
    users.push({
        firstName,
        lastName,
        username,
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! You can now login.");
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

function openSettingsModal() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) return;

    document.getElementById("settingsFirstName").value = user.firstName;
    document.getElementById("settingsLastName").value = user.lastName;
    document.getElementById("settingsUsername").value = user.username;
    document.getElementById("settingsPassword").value = "";

    document.getElementById("settingsModal").style.display = "block";
}

function closeSettingsModal() {
    document.getElementById("settingsModal").style.display = "none";
}

function saveSettingsChanges() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const newFirstName = document.getElementById("settingsFirstName").value;
    const newLastName = document.getElementById("settingsLastName").value;
    const newUsername = document.getElementById("settingsUsername").value;
    const newPassword = document.getElementById("settingsPassword").value;

    const userIndex = users.findIndex(user =>
        user.username === currentUser.username
    );

    if (userIndex === -1) {
        alert("User not found!");
        return;
    }

    users[userIndex].firstName = newFirstName;
    users[userIndex].lastName = newLastName;
    users[userIndex].username = newUsername;

    if (newPassword.trim() !== "") {
        users[userIndex].password = newPassword;
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
    localStorage.setItem("username", newUsername);

    alert("Settings updated successfully!");

    location.reload();
}

// ================= LESSON SYSTEM (JSON-BASED) =================

// Storage for all courses
let courseData = {};
let currentTopic = "";
let currentLessonIndex = 0;

// Load ALL JSON files
Promise.all([
    fetch('HTMLCourse.json').then(res => res.json()),
    fetch('CSSCourse.json').then(res => res.json()),
    fetch('JSCourse.json').then(res => res.json())
])
.then(([htmlData, cssData, jsData]) => {
    courseData = {
        ...htmlData,
        ...cssData,
        ...jsData
    };
})
.catch(err => {
    console.error("Error loading course data:", err);
});

// Start lesson
function startLesson(topic) {
    currentTopic = topic;
    currentLessonIndex = 0;

    showLesson();

    localStorage.setItem('currentTopic', topic);
    localStorage.setItem('lessonIndex', currentLessonIndex);
}

// Show lesson
function showLesson() {
    if (!courseData[currentTopic]) {
        alert("Lesson not loaded yet. Please try again.");
        return;
    }

    const lesson = courseData[currentTopic][currentLessonIndex];

    document.getElementById('lessonTitle').innerText = lesson.title;
    document.getElementById('lessonText').innerText = lesson.content;

    document.getElementById('lessonContent').style.display = "block";
}

// Next lesson
function nextLesson() {
    if (!courseData[currentTopic]) return;

    currentLessonIndex++;

    if (currentLessonIndex >= courseData[currentTopic].length) {
        alert("🎉 You finished this course!");
        return;
    }

    showLesson();

    localStorage.setItem('lessonIndex', currentLessonIndex);
}

// Previous lesson
function prevLesson() {
    if (currentLessonIndex > 0) {
        currentLessonIndex--;
        showLesson();

        localStorage.setItem('lessonIndex', currentLessonIndex);
    }
}

// Complete lesson (progress system)
function completeLesson() {
    let progress = localStorage.getItem('progress') || 0;

    progress = parseInt(progress) + 10;

    if (progress > 100) progress = 100;

    localStorage.setItem('progress', progress);

    alert("Lesson completed! 🎉 Progress updated.");
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
        const res = await fetch('QuizData.json');
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
        btn.className = "btn-quiz-outline";
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
