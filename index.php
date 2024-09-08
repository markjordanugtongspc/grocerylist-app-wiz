<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grocery List App</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="images/grocery.ico" type="image/x-icon">
</head>

<body>
    <div class="container">
        <div id="notification" class="notification hidden">You have successfully registered. Please login now.</div>
        <div id="error-message" class="notification hidden">
            <span id="error-text"></span>
            <span class="close-icon" onclick="this.parentElement.style.display='none';">×</span>
        </div>
        <h2>Login</h2>
        <form id="authForm" action="backend/authentication.php" method="POST">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="button-group">
                <button type="submit" class="btn-primary">Login</button>
                <button type="button" class="btn-secondary" onclick="window.location.href='frontend/authentication/signup.php'">Sign Up</button>
            </div>
        </form>
    </div>
    <script src="scripts.js"></script>
</body>

</html>
