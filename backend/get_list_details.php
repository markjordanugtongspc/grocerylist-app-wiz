<?php
session_start();
require_once 'database/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

if (!isset($_GET['listId'])) {
    echo json_encode(['success' => false, 'error' => 'List ID not provided']);
    exit();
}

$listId = $_GET['listId'];

// Debugging: Log the listId and username
error_log("Fetching details for listId: $listId, username: " . $_SESSION['username']);

$stmt = $conn->prepare("SELECT ListName, DueDate, Priority FROM GroceryList WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
$stmt->bind_param("is", $listId, $_SESSION['username']);
$stmt->execute();
$result = $stmt->get_result();
$list = $result->fetch_assoc();

if ($list) {
    echo json_encode(['success' => true, 'list' => $list]);
} else {
    // Debugging: Log the error
    error_log("List not found for listId: $listId, username: " . $_SESSION['username']);
    echo json_encode(['success' => false, 'error' => 'List not found']);
}

$stmt->close();
$conn->close();
?>