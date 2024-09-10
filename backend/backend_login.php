<?php
include 'backend/database/config.php'; // Include database configuration

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure username and password are provided
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username']; // Get username
        $password = $_POST['password']; // Get password

        // Check if user exists in the database
        $sql = "SELECT * FROM users WHERE Username='$username'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) { // If user exists
            $row = $result->fetch_assoc(); // Fetch user data
            if (password_verify($password, $row['Password'])) { // Verify password
                echo 'Login successful!'; // Success message
            } else {
                echo 'Invalid username or password.'; // Error message for wrong password
            }
        } else {
            echo 'Invalid username or password.'; // Error message for user not found
        }
    }
}

$conn->close(); // Close the database connection
?>