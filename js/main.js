import { usernameInput, logInButton, toggleLogInButton } from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.classList.add('container');
    document.body.append(container);

    usernameInput();
    logInButton();

    document.getElementById('username').addEventListener('keyup', (event) => {

        toggleLogInButton(event.target.value !== ' '.repeat(event.target.value.length));
    });

})