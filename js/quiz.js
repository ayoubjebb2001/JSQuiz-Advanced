import { createQuizInterface, displayQuestion, updateProgressBar, updateGlobalTimer, updateQuestionTimer, showError, showQuizResults } from './ui.js';
// import { saveGameHistory } from './storage.js';
import { quizApp } from './main.js';


/**
 * Start quiz with selected theme
 * @param {string} theme - Selected theme name
 */
async function startQuiz(theme) {
    try {

        quizApp.currentTheme = theme;
        const quizData = await loadQuizData(theme);

        quizApp.currentQuestions = selectRandomQuestions(quizData, 10);
        quizApp.currentQuestionIndex = 0;
        quizApp.userAnswers = [];

        createQuizInterface();


        displayFirstQuestion();


        startTimers();


        setupQuizEventListeners();

    } catch (error) {
        showError('Failed to load quiz. Please try again.');
    }

}

/**
 * Display the first question and start the quiz
 */
function displayFirstQuestion() {
    if (quizApp.currentQuestions.length > 0) {
        displayQuestion(quizApp.currentQuestions[0], 0);
        updateProgressBar(1, quizApp.currentQuestions.length);
        quizApp.startTime = Date.now();
    }
}

/**
 * Setup event listeners for quiz controls
 */
function setupQuizEventListeners() {
    const nextBtn = document.getElementById('next-btn');
    const skipBtn = document.getElementById('skip-btn');

    nextBtn.addEventListener('click', () => {
        saveCurrentAnswer();
        nextQuestion();
    });

    skipBtn.addEventListener('click', () => {
        quizApp.userAnswers[quizApp.currentQuestionIndex] = [];
        nextQuestion();
    });
}

/**
 * Save current selected answer
 */
function saveCurrentAnswer() {
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(input => parseInt(input.value));

    quizApp.userAnswers[quizApp.currentQuestionIndex] = selectedAnswers;
}

/**
 * Move to next question or end quiz
 */
function nextQuestion() {
    clearInterval(quizApp.questionTimer);

    quizApp.currentQuestionIndex++;

    if (quizApp.currentQuestionIndex < quizApp.currentQuestions.length) {

        displayQuestion(quizApp.currentQuestions[quizApp.currentQuestionIndex], quizApp.currentQuestionIndex);
        updateProgressBar(quizApp.currentQuestionIndex + 1, quizApp.currentQuestions.length);
        startQuestionTimer();
    } else {

        endQuiz();
    }
}


/**
 * End the quiz and show results
 */
function endQuiz() {
    clearInterval(quizApp.questionTimer);
    clearInterval(quizApp.globalTimer);

    const endTime = Date.now();
    quizApp.totalTime = Math.floor((endTime - quizApp.startTime) / 1000);

    quizApp.score = calculateScore();

    // saveGameHistory(quizApp.score, quizApp.totalTime , quizApp.currentQuestions , quizApp.userAnswers , quizApp.currentTheme);
    showQuizResults(quizApp.score, quizApp.totalTime, quizApp.currentQuestions, quizApp.userAnswers, quizApp.currentTheme);
}

/**
 * Calculate quiz score
 * @returns {number} Number of correct answers
 */
function calculateScore() {
    let correct = 0;

    for (let i = 0; i < quizApp.currentQuestions.length; i++) {
        const question = quizApp.currentQuestions[i];
        const userAnswer = quizApp.userAnswers[i] || [];


        if (arraysEqual(question.correct.sort(), userAnswer.sort())) {
            correct++;
        }
    }

    return correct;
}



/**
 * Start question and global timers
 */
function startTimers() {
    startQuestionTimer();
    startGlobalTimer();
}

/**
 * Start timer for current question
 */
function startQuestionTimer() {
    let timeLeft = quizApp.questionTimeLimit;
    updateQuestionTimer(timeLeft);

    quizApp.questionTimer = setInterval(() => {
        timeLeft--;
        updateQuestionTimer(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(quizApp.questionTimer);
            // Auto-skip to next question
            handleTimeUp();
        }
    }, 1000);
}

/**
 * Start global timer for entire quiz
 */
function startGlobalTimer() {
    let timeLeft = 0;
    updateGlobalTimer(timeLeft);

    quizApp.globalTimer = setInterval(() => {
        timeLeft++;
        updateGlobalTimer(timeLeft);

    }, 1000);
}

/**
 * Handle when question time runs out
 */
function handleTimeUp() {

    quizApp.userAnswers[quizApp.currentQuestionIndex] = [];

    nextQuestion();
}


/**
 * Load quiz data from JSON file
 * @param {string} theme - Theme name
 * @returns {Promise<Object>} Quiz data
 */
async function loadQuizData(theme) {
    try {
        const response = await fetch(`../data/${theme}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${theme} questions`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading quiz data:', error);
        throw error;
    }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Copie pour ne pas modifier l'original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random questions from quiz data
 * @param {Object} quizData - Complete quiz data
 * @param {number} count - Number of questions to select
 * @returns {Array} Selected questions
 */
function selectRandomQuestions(quizData, count = 10) {
    const shuffledQuestions = shuffleArray(quizData.questions);
    return shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length));
}


/**
 * Compare two arrays for equality
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {boolean}
 */
function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length &&
        arr1.every((val, index) => val === arr2[index]);
}


export { startQuiz, arraysEqual }