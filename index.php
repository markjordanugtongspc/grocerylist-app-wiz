<?php
include 'backend.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grocery List App</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" href="images/grocery.ico" type="image/x-icon">
</head>

<body class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 id="form-title" class="text-2xl font-bold mb-6 text-center">Login</h2>
        <form id="authForm" action="backend.php" method="POST">
            <div id="login-fields">
                <div class="mb-4">
                    <label for="username" class="block text-gray-700">Username</label>
                    <input type="text" id="username" name="username" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-gray-700">Password</label>
                    <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-6">
                    <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Login</button>
                </div>
                <div class="text-center">
                    <button type="button" id="show-signup" class="text-red-500">Sign Up</button>
                </div>
            </div>
            <div id="signup-fields" class="hidden">
                <div class="mb-4">
                    <label for="new-username" class="block text-gray-700">Username</label>
                    <input type="text" id="new-username" name="new-username" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-4">
                    <label for="new-password" class="block text-gray-700">Password</label>
                    <input type="password" id="new-password" name="new-password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-6">
                    <button type="submit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Sign Up</button>
                </div>
                <div class="text-center">
                    <button type="button" id="show-login" class="text-blue-500">Back to Login</button>
                </div>
            </div>
        </form>
    </div>

    <!-- Modal -->
    <div id="modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden">
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <p class="mb-4">You have successfully registered. Please login now.</p>
            <button id="modal-ok" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">OK</button>
        </div>
    </div>

    <script src="scripts.js"></script>
</body>

</html>