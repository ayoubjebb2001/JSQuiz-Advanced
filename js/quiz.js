import { createQuizInterface, displayQuestion, updateProgressBar, updateGlobalTimer, updateQuestionTimer, showError, showQuizResults } from './ui.js';
import { saveGameHistory } from './storage.js';

let currentQuestions = [];
let currentQuestionIndex = 0;
let questionTimer = null;
let globalTimer = null;
let startTime = null;
let questionTimeLimit = 20; // secondes par question
let userAnswers = [];
let currentTheme = '';

/**
 * Start quiz with selected theme
 * @param {string} theme - Selected theme name
 */
async function startQuiz(theme) {
    try {

        currentTheme = theme;
        const quizData = await loadQuizData(theme);

        currentQuestions = selectRandomQuestions(quizData, 10);
        currentQuestionIndex = 0;
        userAnswers = [];

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
    if (currentQuestions.length > 0) {
        displayQuestion(currentQuestions[0], 0);
        updateProgressBar(1, currentQuestions.length);
        startTime = Date.now();
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
        userAnswers[currentQuestionIndex] = [];
        nextQuestion();
    });
}

/**
 * Save current selected answer
 */
function saveCurrentAnswer() {
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(input => parseInt(input.value));

    userAnswers[currentQuestionIndex] = selectedAnswers;
}

/**
 * Move to next question or end quiz
 */
function nextQuestion() {
    clearInterval(questionTimer);

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {

        displayQuestion(currentQuestions[currentQuestionIndex], currentQuestionIndex);
        updateProgressBar(currentQuestionIndex + 1, currentQuestions.length);
        startQuestionTimer();
    } else {
        // Quiz terminé
        endQuiz();
    }
}


/**
 * End the quiz and show results
 */
function endQuiz() {
    clearInterval(questionTimer);
    clearInterval(globalTimer);

    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);

    const score = calculateScore();

    saveGameHistory(score, totalTime , currentQuestions , userAnswers , currentTheme);
    showQuizResults(score, totalTime, currentQuestions, userAnswers, currentTheme);
}

/**
 * Calculate quiz score
 * @returns {number} Number of correct answers
 */
function calculateScore() {
    let correct = 0;

    for (let i = 0; i < currentQuestions.length; i++) {
        const question = currentQuestions[i];
        const userAnswer = userAnswers[i] || [];


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
    let timeLeft = questionTimeLimit;
    updateQuestionTimer(timeLeft);

    questionTimer = setInterval(() => {
        timeLeft--;
        updateQuestionTimer(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(questionTimer);
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

    globalTimer = setInterval(() => {
        timeLeft++;
        updateGlobalTimer(timeLeft);

    }, 1000);
}

/**
 * Handle when question time runs out
 */
function handleTimeUp() {

    userAnswers[currentQuestionIndex] = [];

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