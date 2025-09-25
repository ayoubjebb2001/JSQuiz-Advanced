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

export { usernameInput, logInButton, toggleLogInButton, createThemeCards, showWelcomeMessage };
