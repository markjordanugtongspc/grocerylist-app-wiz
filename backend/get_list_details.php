<?php
session_start();
require_once 'database/config.php'; // Include database configuration

header('Content-Type: application/json'); // Set response type to JSON

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']); // Return error if not logged in
    exit(); // Stop further execution
}

// Check if list ID is provided in the query parameters
if (!isset($_GET['listId'])) {
    echo json_encode(['success' => false, 'error' => 'List ID not provided']); // Return error if list ID is missing
    exit(); // Stop further execution
}

$listId = $_GET['listId']; // Get the list ID from the query parameter

// Debugging: Log the listId and username
error_log("Fetching details for listId: $listId, username: " . $_SESSION['username']);

// Prepare SQL statement to fetch list details
$stmt = $conn->prepare("SELECT ListName, DueDate, Priority FROM GroceryList WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
$stmt->bind_param("is", $listId, $_SESSION['username']); // Bind parameters
$stmt->execute(); // Execute the query
$result = $stmt->get_result(); // Get the result set
$list = $result->fetch_assoc(); // Fetch the list details

if ($list) {
    echo json_encode(['success' => true, 'list' => $list]); // Return success response with list details
} else {
    // Debugging: Log the error
    error_log("List not found for listId: $listId, username: " . $_SESSION['username']);
    echo json_encode(['success' => false, 'error' => 'List not found']); // Return error if list not found
}

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection
