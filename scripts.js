document.addEventListener('DOMContentLoaded', function() {
    const showSignupButton = document.getElementById('show-signup');
    const showLoginButton = document.getElementById('show-login');
    const loginFields = document.getElementById('login-fields');
    const signupFields = document.getElementById('signup-fields');
    const formTitle = document.getElementById('form-title');
    const modal = document.getElementById('modal');
    const modalOkButton = document.getElementById('modal-ok');

    showSignupButton.addEventListener('click', function() {
        loginFields.classList.add('hidden');
        signupFields.classList.remove('hidden');
        formTitle.textContent = 'Sign Up';
    });

    showLoginButton.addEventListener('click', function() {
        signupFields.classList.add('hidden');
        loginFields.classList.remove('hidden');
        formTitle.textContent = 'Login';
    });

    modalOkButton.addEventListener('click', function() {
        modal.classList.add('hidden');
        signupFields.classList.add('hidden');
        loginFields.classList.remove('hidden');
        formTitle.textContent = 'Login';
        window.location.reload();
    });

    // Check if registration was successful
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        modal.classList.remove('hidden');
    }
});
