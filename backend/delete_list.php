<?php
session_start();
require_once '../../backend/database/config.php';

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$listId = $data['listId'];

$stmt = $conn->prepare("UPDATE GroceryList SET LastModified = NULL WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
$stmt->bind_param("is", $listId, $_SESSION['username']);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();