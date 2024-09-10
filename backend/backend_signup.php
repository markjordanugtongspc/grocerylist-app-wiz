<?php
include 'database/config.php'; // Include database configuration

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure required fields are provided
    if (isset($_POST['new-username']) && isset($_POST['new-password']) && isset($_POST['email'])) {
        $newUsername = $_POST['new-username']; // Get new username
        $newPassword = password_hash($_POST['new-password'], PASSWORD_DEFAULT); // Hash the new password
        $email = $_POST['email']; // Get email
        $dateCreated = date('Y-m-d H:i:s'); // Get the current date and time

        // Insert new user into the database
        $sql = "INSERT INTO users (Username, Email, Password, DateCreated) VALUES ('$newUsername', '$email', '$newPassword', '$dateCreated')";
        if ($conn->query($sql) === TRUE) {
            header('Location: ../index.php?registered=true'); // Redirect to index with success message
            exit(); // Stop further execution
        } else {
            echo 'Error: ' . $sql . '<br>' . $conn->error; // Show error message if insert fails
        }
    }
}

$conn->close(); // Close the database connection
?>