document.addEventListener('DOMContentLoaded', function() {
    // Check if registration was successful
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        const notification = document.getElementById('notification');
        notification.classList.remove('hidden');
        setTimeout(function() {
            notification.classList.add('hidden');
            window.location.href = 'index.php'; // Redirect to index.php after notification
        }, 3000); // 3 seconds delay
    }

    // Check if there is an error message
    if (urlParams.get('error')) {
        const errorMessage = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        const error = urlParams.get('error');

        if (error === 'incorrect%password') {
            errorText.textContent = 'Incorrect Password!';
        } else if (error === '404%user%not%found') {
            errorText.textContent = 'No User Found, Please register first!';
        } else if (error === 'please%login%first') {
            errorText.textContent = 'Please Login First!';
        }

        errorMessage.classList.remove('hidden');
    }
});
