<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grocery List App - Sign Up</title>
    <link rel="stylesheet" href="styles_signup.css">
    <link rel="icon" href="../../images/grocery.ico" type="image/x-icon">
</head>

<body>
    <div class="container">
        <h2>Sign Up</h2>
        <form id="signupForm" action="../../backend/backend_signup.php" method="POST">
            <div class="form-group">
                <label for="new-username">Username</label>
                <input type="text" id="new-username" name="new-username" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="new-password">Password</label>
                <input type="password" id="new-password" name="new-password" required>
            </div>
            <div class="button-group">
                <button type="submit" class="btn-primary">Sign Up</button>
                <a href="\Github\IT-ELEC-PRELIM\index.php" class="btn-secondary">Back to Login</a>
            </div>
        </form>
    </div>

    <script src="scripts.js"></script>
</body>

</html>