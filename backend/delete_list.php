<?php
session_start();
require_once '../../backend/database/config.php'; // Include database configuration

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']); // Return error if not logged in
    exit(); // Stop further execution
}

// Get the JSON input from the request body
$data = json_decode(file_get_contents('php://input'), true); // Decode JSON input
$listId = $data['listId']; // Get the list ID from the input

// Prepare SQL statement to update the list's LastModified field
$stmt = $conn->prepare("UPDATE GroceryList SET LastModified = NULL WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
$stmt->bind_param("is", $listId, $_SESSION['username']); // Bind parameters

if ($stmt->execute()) {
    echo json_encode(['success' => true]); // Return success response
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]); // Return error if update fails
}

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection
?>