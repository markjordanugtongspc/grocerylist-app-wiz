<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Dummy authentication check
        if ($username === 'admin' && $password === 'password') {
            echo 'Login successful!';
        } else {
            echo 'Invalid username or password.';
        }
    } elseif (isset($_POST['new-username']) && isset($_POST['new-password'])) {
        $newUsername = $_POST['new-username'];
        $newPassword = $_POST['new-password'];

        // Dummy registration logic
        echo '<script>
                window.onload = function() {
                    document.getElementById("modal").classList.remove("hidden");
                }
              </script>';
    }
}