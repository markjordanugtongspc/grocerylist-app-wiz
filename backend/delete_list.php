<?php
session_start();
require_once 'database/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$listId = intval($_GET['listId']);

try {
    $conn->begin_transaction();

    // Delete from selectedproducts
    $stmt = $conn->prepare("DELETE FROM selectedproducts WHERE ListID = ?");
    $stmt->bind_param("i", $listId);
    $stmt->execute();

    // Delete from grocerylist
    $stmt = $conn->prepare("DELETE FROM grocerylist WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("is", $listId, $_SESSION['username']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'List deleted successfully']);
    } else {
        throw new Exception('No list deleted');
    }
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $stmt->close();
    $conn->close();
}