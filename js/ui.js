import { startQuiz } from "./quiz";

/**
 * create username input field
 */
function usernameInput() {
    const usernameInputNode = document.createElement('div');
    usernameInputNode.classList.add('username');
    usernameInputNode.innerHTML = `<input type="text" placeholder="Enter your username" id="username">`
    document.body.firstElementChild.append(usernameInputNode);
}

/**
 * create login button
 */
function logInButton() {
    const loginNode = document.createElement('div');
    loginNode.classList.add(...['login', 'btn', 'disabled']);
    loginNode.setAttribute('data-disabled', true);
    loginNode.setAttribute('id', 'login');
    loginNode.innerText = 'login';
    document.body.firstElementChild.append(loginNode);
}

/**
 * Toggle the login button state
 * @param {boolean} enable - Whether to enable or disable the button
 */
function toggleLogInButton(enable) {
    if (enable) {
        document.getElementById('login').removeAttribute('data-disabled');
        document.getElementById('login').classList.remove('disabled');

    }
    else {
        document.getElementById('login').setAttribute('data-disabled', true);
        document.getElementById('login').classList.add('disabled');
    }
}

/**
 * Create theme selection cards for available quiz categories
 * @param {Array} themes - Array of theme names
 */
function createThemeCards(themes) {
    // Remove login elements
    const usernameDiv = document.querySelector('.username');
    const loginBtn = document.getElementById('login');
    if (usernameDiv) usernameDiv.remove();
    if (loginBtn) loginBtn.remove();

    // Create theme selection container
    const themeContainer = document.createElement('div');
    themeContainer.classList.add('theme-selection');
    themeContainer.innerHTML = `
        <h2>Choose a Quiz Theme</h2>
        <div class="theme-cards"></div>
    `;

    const themeCardsContainer = themeContainer.querySelector('.theme-cards');

    // Create card for each theme
    themes.forEach(theme => {
        const card = document.createElement('div');
        card.classList.add('theme-card');
        card.setAttribute('data-theme', theme);

        // Capitalize theme name and add description
        const themeName = theme.charAt(0).toUpperCase() + theme.slice(1);
        const descriptions = {
            arrays: 'Test your knowledge of JavaScript array methods',
            boolean: 'Learn about boolean logic and truthy/falsy values',
            functions: 'Master JavaScript functions, closures, and scope',
            numbers: 'Explore number operations and Math methods',
            objects: 'Understand object manipulation and methods',
            promises: 'Dive into asynchronous programming and Promises',
            syntax: 'Review basic JavaScript syntax and fundamentals'
        };

        card.innerHTML = `
            <h3>${themeName}</h3>
            <p>${descriptions[theme] || 'Test your JavaScript knowledge'}</p>
            <button class="start-theme-btn">Start Quiz</button>
        `;

        themeCardsContainer.appendChild(card);
    });

    document.body.firstElementChild.appendChild(themeContainer);

}

/**
 * Show welcome message for logged in user
 * @param {string} username - The logged in username
 */
function showWelcomeMessage(username) {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.classList.add('welcome-message');
    welcomeDiv.innerHTML = `<h2>Welcome back, ${username}!</h2>`;
    document.body.firstElementChild.prepend(welcomeDiv);
}

/**
 * Create quiz interface with timers and progress bar
 */
function createQuizInterface() {
    const quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');
    quizContainer.innerHTML = `
        <div class="quiz-header">
            <div class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <span class="progress-text" id="progress-text">Question 1 of 10</span>
            </div>
            <div class="timers">
                <div class="question-timer">
                    <span class="timer-label">Question:</span>
                    <span class="timer-value" id="question-timer">20s</span>
                </div>
                <div class="global-timer">
                    <span class="timer-label">Total:</span>
                    <span class="timer-value" id="global-timer">05:00</span>
                </div>
            </div>
        </div>
        <div class="quiz-content">
            <div class="question-section" id="question-section">
                <!-- Questions will be injected here -->
            </div>
            <div class="quiz-controls">
                <button class="btn next-btn" id="next-btn" disabled>Next Question</button>
                <button class="btn skip-btn" id="skip-btn">Skip Question</button>
            </div>
        </div>
    `;

    // Clear existing content and add quiz interface
    const container = document.body.firstElementChild;
    container.innerHTML = '';
    container.appendChild(quizContainer);
}

/**
 * Display current question with answers
 * @param {Object} question - Question object
 * @param {number} questionIndex - Current question index
 */
function displayQuestion(question, questionIndex) {
    const questionSection = document.getElementById('question-section');
    const isMultipleChoice = question.correct.length > 1;

    questionSection.innerHTML = `
        <div class="question">
            <h3>Question ${questionIndex + 1}</h3>
            <p class="question-text">${question.question}</p>
        </div>
        <div class="answers" id="answers-container">
            ${question.answers.map((answer, index) => `
                <label class="answer-option">
                    <input type="${isMultipleChoice ? 'checkbox' : 'radio'}" 
                           name="answer" 
                           value="${index}"
                           id="answer-${index}">
                    <span class="answer-text">${answer}</span>
                </label>
            `).join('')}
        </div>
    `;

    // Add event listeners for answer selection
    const answerInputs = document.querySelectorAll('input[name="answer"]');
    answerInputs.forEach(input => {
        input.addEventListener('change', handleAnswerSelection);
    });
}


/**
 * Handle answer selection
 */
function handleAnswerSelection() {
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(input => parseInt(input.value));

    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = selectedAnswers.length === 0;
}

/**
 * Update progress bar
 * @param {number} current - Current question number
 * @param {number} total - Total questions
 */
function updateProgressBar(current, total) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    const percentage = (current / total) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Question ${current} of ${total}`;
}

/**
 * Update question timer display
 * @param {number} timeLeft - Time remaining in seconds
 */
function updateQuestionTimer(timeLeft) {
    const timerElement = document.getElementById('question-timer');
    timerElement.textContent = `${timeLeft}s`;

    // Add warning class when time is running low
    if (timeLeft <= 5) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

/**
 * Update global timer display
 * @param {number} timeLeft - Time remaining in seconds
 */
function updateGlobalTimer(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.getElementById('global-timer');
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Add warning class when time is running low
    if (timeLeft <= 60) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

/**
 * Show error message
 * @param {string} message 
 */
function showError(message) {
    const container = document.body.firstElementChild;
    container.innerHTML = `
        <div class="error-container">
            <h2>Error</h2>
            <p>${message}</p>
            <button class="btn" onclick="location.reload()">Try Again</button>
        </div>
    `;
}

/**
 * Display quiz results with detailed breakdown
 * @param {number} score - Number of correct answers
 * @param {number} totalTime - Total time taken in seconds
 * @param {Array} questions - Array of questions
 * @param {Array} userAnswers - User's answers
 */
function showQuizResults(score, totalTime, questions, userAnswers, theme) {
    const container = document.body.firstElementChild;
    const percentage = Math.round((score / questions.length) * 100);

    // Format time
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate performance level
    const getPerformanceLevel = (percentage) => {
        if (percentage >= 90) return { level: 'Excellent', class: 'excellent', emoji: '🏆' };
        if (percentage >= 80) return { level: 'Great', class: 'great', emoji: '🎉' };
        if (percentage >= 70) return { level: 'Good', class: 'good', emoji: '👍' };
        if (percentage >= 60) return { level: 'Fair', class: 'fair', emoji: '📚' };
        return { level: 'Needs Improvement', class: 'poor', emoji: '💪' };
    };

    const performance = getPerformanceLevel(percentage);

    container.innerHTML = `
        <div class="results-container">
            <div class="results-header">
                <div class="performance-badge ${performance.class}">
                    <span class="performance-emoji">${performance.emoji}</span>
                    <h2>${performance.level}!</h2>
                </div>
                
                <div class="score-summary">
                    <div class="score-circle">
                        <div class="score-text">
                            <span class="score-number">${score}</span>
                            <span class="score-total">/${questions.length}</span>
                        </div>
                        <div class="score-percentage">${percentage}%</div>
                    </div>
                </div>
                
                <div class="quiz-stats">
                    <div class="stat-item">
                        <span class="stat-label">Theme</span>
                        <span class="stat-value">${theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Time Taken</span>
                        <span class="stat-value">${formattedTime}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Average per Question</span>
                        <span class="stat-value">${Math.round(totalTime / questions.length)}s</span>
                    </div>
                </div>
            </div>
            
            <div class="results-details">
                <h3>Question Review</h3>
                <div class="questions-review">
                    ${questions.map((question, index) => {
        const userAnswer = userAnswers[index] || [];
        const isCorrect = arraysEqual(question.correct.sort(), userAnswer.sort());
        const isSkipped = userAnswer.length === 0;

        return `
                            <div class="review-question ${isCorrect ? 'correct' : isSkipped ? 'skipped' : 'incorrect'}">
                                <div class="review-header">
                                    <span class="question-number">Q${index + 1}</span>
                                    <span class="question-status">
                                        ${isCorrect ? '✅ Correct' : isSkipped ? '⏭️ Skipped' : '❌ Incorrect'}
                                    </span>
                                </div>
                                <div class="review-question-text">${question.question}</div>
                                
                                <div class="review-answers">
                                    ${question.answers.map((answer, answerIndex) => {
            const isUserSelected = userAnswer.includes(answerIndex);
            const isCorrectAnswer = question.correct.includes(answerIndex);

            let answerClass = '';
            if (isCorrectAnswer && isUserSelected) answerClass = 'correct-selected';
            else if (isCorrectAnswer) answerClass = 'correct-not-selected';
            else if (isUserSelected) answerClass = 'incorrect-selected';

            return `
                                            <div class="review-answer ${answerClass}">
                                                <span class="answer-indicator">
                                                    ${isUserSelected ? (isCorrectAnswer ? '✅' : '❌') : (isCorrectAnswer ? '✅' : '')}
                                                </span>
                                                <span class="answer-text">${answer}</span>
                                            </div>
                                        `;
        }).join('')}
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
            
            <div class="results-actions">
                <button class="btn primary-btn" id="retake-quiz">Retake Quiz</button>
                <button class="btn secondary-btn" id="new-theme">Choose New Theme</button>
                <button class="btn tertiary-btn" id="view-stats">View Statistics</button>
            </div>
        </div>
    `;

    setupResultsEventListeners();
}

/**
 * Setup event listeners for results page actions
 */
function setupResultsEventListeners() {
    const retakeBtn = document.getElementById('retake-quiz');
    const newThemeBtn = document.getElementById('new-theme');
    const viewStatsBtn = document.getElementById('view-stats');

    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            

        });
    }

    if (newThemeBtn) {
        newThemeBtn.addEventListener('click', () => {

        });
    }

    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', () => {

        });
    }
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

export { usernameInput, logInButton, toggleLogInButton, createThemeCards, showWelcomeMessage, createQuizInterface, displayQuestion, updateProgressBar, updateQuestionTimer, updateGlobalTimer, showError, showQuizResults };
