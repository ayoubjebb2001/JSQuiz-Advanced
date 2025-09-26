import { usernameInput, logInButton, toggleLogInButton, createThemeCards, showWelcomeMessage } from "./ui.js";
import {  getAvailableThemes , loadUserData} from "./storage.js";
import { startQuiz } from "./quiz.js";

let activeUser = null;
document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.classList.add('container');
    document.body.append(container);

    usernameInput();
    logInButton();

    // Handle username input changes
    document.getElementById('username').addEventListener('keyup', (event) => {
        const isValid = event.target.value.trim().length > 0 &&
            event.target.value !== ' '.repeat(event.target.value.length);
        toggleLogInButton(isValid);
    });

    // Handle login button click
    document.getElementById('login').addEventListener('click', handleLogin);
});



/**
 * Handle user login process
 */
async function handleLogin() {
    const username = document.getElementById('username').value.trim();

    if (!username || username === ' '.repeat(username.length)) {
        const errorMsg = document.createElement('span');
        errorMsg.classList.add('error-message');
        if (!document.querySelector('.error-message')) {
            errorMsg.innerText = 'Please enter a valid username';
            document.querySelector('.username').appendChild(errorMsg);
        }
        return;
    }

    
    try {
        // Load or create user data
        activeUser = loadUserData(username);

        // Show welcome message
        showWelcomeMessage(username);

        // Get available themes and show selection cards
        const themes = await getAvailableThemes();
        createThemeCards(themes);
             // Add event listeners for theme selection
        addThemeEventListeners();

       

    } catch (error) {
        console.error('Login error:', error);
    }
}


/**
 * Add event listeners for theme card selection
 */
function addThemeEventListeners() {
    const themeCards = document.querySelectorAll('.theme-card');

    themeCards.forEach(card => {
        const startBtn = card.querySelector('.start-theme-btn');
        startBtn.addEventListener('click', () => {
            const theme = card.getAttribute('data-theme');
            startQuiz(theme);
        });

        // Also allow clicking the card itself
        card.addEventListener('click', (event) => {
            if (!event.target.classList.contains('start-theme-btn')) {
                const theme = card.getAttribute('data-theme');
                startQuiz(theme);
            }
        });
    });
}