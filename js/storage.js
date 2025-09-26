
/**
 * Load user data from localStorage or create new user if not found
 * @param {string} username - The username to load or create
 * @returns {Object} User data object with username and history
 */
function loadUserData(username) {
    let activeUser = { username: username, history: [] };
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.length === 0) {
        users.push(activeUser);
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        let found = users.find((user) => user.username === username);
        if (found === undefined) {
            users.push(activeUser);
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            activeUser = found;
        }
    }
    return activeUser;
}

/**
 * Save user data to localStorage
 * @param {Object} userData - User data object to save
 */
function saveUserData(userData) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(user => user.username === userData.username);

    if (userIndex !== -1) {
        users[userIndex] = userData;
    } else {
        users.push(userData);
    }

    localStorage.setItem('users', JSON.stringify(users));
}



/**
 * Get available themes from data directory
 * @returns {Array} Array of theme names
 */
async function getAvailableThemes() {
    // List of available theme files in the data directory
    return [
        'arrays',
        'boolean',
        'functions',
        'numbers',
        'objects',
        'promises',
        'syntax'
    ];
}

/**
 * Load quiz data for a specific theme
 * @param {string} theme - Theme name to load
 * @returns {Promise<Object>} Quiz data object
 */
async function loadQuizData(theme) {
    try {
        const response = await fetch(`../data/${theme}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${theme} data`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading quiz data for ${theme}:`, error);
        throw error;
    }
}

async function saveGameHistory(score, totalTime, currentQuestions,userAnswers, currentTheme) {
    
}

export { loadUserData, saveUserData, getAvailableThemes, loadQuizData };
