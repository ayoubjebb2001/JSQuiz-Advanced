function usernameInput() {
    const usernameInputNode = document.createElement('div');
    usernameInputNode.classList.add('username');
    usernameInputNode.innerHTML = `<input type="text" placeholder="Enter your username" id="username">`
    document.body.firstElementChild.append(usernameInputNode);
}

function logInButton() {
    const loginNode = document.createElement('div');
    loginNode.classList.add(...['login', 'btn', 'disabled']);
    loginNode.setAttribute('data-disabled', true);
    loginNode.setAttribute('id', 'login');
    loginNode.innerText = 'login';
    document.body.firstElementChild.append(loginNode);
}

function themesInput() {
    const themesInputNode = document.createElement('div');
    themesInputNode.classList.add('themes');
    themesInputNode.append(document.createElement('select'));
    document.body.firstElementChild.append(themesInputNode);
}

function toggleLogInButton(enable) {
    if(enable) {
        document.getElementById('login').removeAttribute('data-disabled');
        document.getElementById('login').classList.remove('disabled');

    }
    else{
        document.getElementById('login').setAttribute('data-disabled',true);
        document.getElementById('login').classList.add('disabled');
    }
}

export { usernameInput, logInButton, toggleLogInButton };
