import { usernameInput, logInButton, toggleLogInButton, createThemeCards, showWelcomeMessage } from "./ui.js";
import { handleLogin , getAvailableThemes } from "./storage.js";


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

