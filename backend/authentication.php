<?php
include 'database/config.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Check if user exists
        $sql = "SELECT * FROM users WHERE Username='$username'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['Password'])) {
                // Successful login
                $_SESSION['username'] = $username;
                header("Location: ../frontend/dashboard/dashboard.php");
                exit();
            } else {
                // Wrong password
                header("Location: ../index.php?error=incorrect%password");
                exit();
            }
        } else {
            // User not found
            header("Location: ../index.php?error=404%user%not%found");
            exit();
        }
    }
}

$conn->close();
