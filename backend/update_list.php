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

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit();
}

try {
    $conn->begin_transaction();

    $stmt = $conn->prepare("UPDATE GroceryList SET ListName = ?, DueDate = ?, Priority = ?, LastModified = NOW() WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("sssss", $data['name'], $data['dueDate'], $data['priority'], $data['id'], $_SESSION['username']);

    if (!$stmt->execute()) {
        throw new Exception("Error updating list: " . $stmt->error);
    }

    // We're not handling products in the database for now
    // You may want to store this information in a separate table in the future

    $stmt = $conn->prepare("SELECT LastModified FROM GroceryList WHERE ListID = ?");
    $stmt->bind_param("s", $data['id']);
    if (!$stmt->execute()) {
        throw new Exception("Error fetching LastModified: " . $stmt->error);
    }
    $result = $stmt->get_result();
    $lastModified = $result->fetch_assoc()['LastModified'];

    $conn->commit();
    echo json_encode(['success' => true, 'lastModified' => $lastModified]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();