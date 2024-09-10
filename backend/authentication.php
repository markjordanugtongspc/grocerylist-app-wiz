<?php
include 'database/config.php'; // Include database configuration

session_start(); // Start the session

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
                // Successful login
                $_SESSION['username'] = $username; // Store username in session
                header("Location: ../frontend/dashboard/dashboard.php"); // Redirect to dashboard
                exit(); // Stop further execution
            } else {
                // Wrong password
                header("Location: ../index.php?error=incorrect%password"); // Redirect to index with error
                exit(); // Stop further execution
            }
        } else {
            // User not found
            header("Location: ../index.php?error=404%user%not%found"); // Redirect to index with error
            exit(); // Stop further execution
        }
    }
}

$conn->close(); // Close the database connection
?>