<?php
include 'backend/database/config.php';

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
                echo 'Login successful!';
            } else {
                echo 'Invalid username or password.';
            }
        } else {
            echo 'Invalid username or password.';
        }
    }
}

$conn->close();