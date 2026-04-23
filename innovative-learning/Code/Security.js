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
window.addEventListener("load", () => {
    checkAuthStatus();
});


function loadProfile() {
    const username = localStorage.getItem('username');

    if (username) {
        document.getElementById('usernameDisplay').innerText = "Hi, " + username + "!";
    }
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
