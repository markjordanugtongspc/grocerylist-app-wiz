<?php
session_start();
require_once 'database/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['newUsername'])) {
    echo json_encode(['success' => false, 'error' => 'New username not provided']);
    exit();
}

$newUsername = $data['newUsername'];
$currentUsername = $_SESSION['username'];

// Check if the new username already exists
$stmt = $conn->prepare("SELECT Username FROM users WHERE Username = ? AND Username != ?");
$stmt->bind_param("ss", $newUsername, $currentUsername);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Username already exists']);
    exit();
}

// Update the username
$stmt = $conn->prepare("UPDATE users SET Username = ? WHERE Username = ?");
$stmt->bind_param("ss", $newUsername, $currentUsername);

if ($stmt->execute()) {
    $_SESSION['username'] = $newUsername; // Update the session with the new username
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]);
}

$stmt->close();
$conn->close();