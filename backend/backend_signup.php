<?php
include 'database/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['new-username']) && isset($_POST['new-password']) && isset($_POST['email'])) {
        $newUsername = $_POST['new-username'];
        $newPassword = password_hash($_POST['new-password'], PASSWORD_DEFAULT);
        $email = $_POST['email'];
        $dateCreated = date('Y-m-d H:i:s'); // Get the current date and time

        // Insert new user
        $sql = "INSERT INTO users (Username, Email, Password, DateCreated) VALUES ('$newUsername', '$email', '$newPassword', '$dateCreated')";
        if ($conn->query($sql) === TRUE) {
            header('Location: ../index.php?registered=true');
            exit();
        } else {
            echo 'Error: ' . $sql . '<br>' . $conn->error;
        }
    }
}

$conn->close();