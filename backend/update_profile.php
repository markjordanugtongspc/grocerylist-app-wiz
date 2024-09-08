<?php
session_start();
header('Content-Type: application/json');

// Enable error logging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debug: Log session data
error_log("Session data: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id'])) {
    error_log("User not logged in. Session ID: " . session_id());
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$response = ['success' => false, 'message' => ''];

// Database connection
$conn = new mysqli('localhost', 'your_username', 'your_password', 'your_database');

if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    $response['message'] = 'Database connection failed';
    echo json_encode($response);
    exit();
}

$userId = $_SESSION['user_id'];
$newUsername = $_POST['newUsername'] ?? '';

if (empty($newUsername)) {
    $response['message'] = 'New username is required';
    echo json_encode($response);
    exit();
}

// Update username
$stmt = $conn->prepare("UPDATE users SET Username = ? WHERE id = ?");
$stmt->bind_param("si", $newUsername, $userId);

if ($stmt->execute()) {
    $_SESSION['username'] = $newUsername;
    $response['success'] = true;
    $response['newUsername'] = $newUsername;
    error_log("Username updated successfully for user ID: " . $userId);
} else {
    error_log("Error updating username: " . $stmt->error);
    $response['message'] = 'Error updating username: ' . $stmt->error;
    echo json_encode($response);
    exit();
}

$stmt->close();

// Handle avatar upload
if (isset($_FILES['newAvatar']) && $_FILES['newAvatar']['error'] == 0) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!in_array($_FILES['newAvatar']['type'], $allowedTypes)) {
        $response['message'] = 'Invalid file type. Only JPEG, PNG, and GIF are allowed.';
        echo json_encode($response);
        exit();
    }

    if ($_FILES['newAvatar']['size'] > $maxFileSize) {
        $response['message'] = 'File is too large. Maximum size is 5MB.';
        echo json_encode($response);
        exit();
    }

    $uploadDir = '../images/avatars/';
    $fileName = uniqid() . '_' . $_FILES['newAvatar']['name'];
    $filePath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['newAvatar']['tmp_name'], $filePath)) {
        $avatarPath = 'images/avatars/' . $fileName;
        
        $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->bind_param("si", $avatarPath, $userId);
        
        if ($stmt->execute()) {
            $_SESSION['avatar'] = $avatarPath;
            $response['newAvatar'] = $avatarPath;
            error_log("Avatar updated successfully for user ID: " . $userId);
        } else {
            error_log("Error updating avatar in database: " . $stmt->error);
            $response['message'] = 'Error updating avatar in database: ' . $stmt->error;
            echo json_encode($response);
            exit();
        }
        
        $stmt->close();
    } else {
        error_log("Error uploading avatar for user ID: " . $userId);
        $response['message'] = 'Error uploading avatar';
        echo json_encode($response);
        exit();
    }
}

$conn->close();

echo json_encode($response);