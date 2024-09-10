<?php
session_start(); // Start the session
require_once 'database/config.php'; // Include database configuration

header('Content-Type: application/json'); // Set response type to JSON

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']); // Return error if not logged in
    exit(); // Stop further execution
}

// Get the raw input data
$input = file_get_contents('php://input');
$data = json_decode($input, true); // Decode the JSON input

// Check if new username is provided
if (!isset($data['newUsername'])) {
    echo json_encode(['success' => false, 'error' => 'New username not provided']); // Return error if not provided
    exit(); // Stop further execution
}

$newUsername = $data['newUsername']; // Get the new username from input
$currentUsername = $_SESSION['username']; // Get the current username

// Check if the new username already exists in the database
$stmt = $conn->prepare("SELECT Username FROM users WHERE Username = ? AND Username != ?");
$stmt->bind_param("ss", $newUsername, $currentUsername); // Bind parameters
$stmt->execute();
$result = $stmt->get_result();

// If a user with the new username exists, return an error
if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Username already exists']); // Return error response
    exit(); // Stop further execution
}

// Update the username in the database
$stmt = $conn->prepare("UPDATE users SET Username = ? WHERE Username = ?");
$stmt->bind_param("ss", $newUsername, $currentUsername); // Bind parameters

if ($stmt->execute()) {
    $_SESSION['username'] = $newUsername; // Update the session with the new username
    echo json_encode(['success' => true]); // Return success response
} else {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]); // Return error response
}

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection