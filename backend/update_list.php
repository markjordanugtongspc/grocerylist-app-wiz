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

    // Update the list details
    $stmt = $conn->prepare("UPDATE GroceryList SET ListName = ?, DueDate = ?, Priority = ?, LastModified = NOW() WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("sssss", $data['name'], $data['dueDate'], $data['priority'], $data['id'], $_SESSION['username']);

    if (!$stmt->execute()) {
        throw new Exception("Error updating list: " . $stmt->error);
    }

    // Clear existing products for this list
    $stmt = $conn->prepare("DELETE FROM ListItems WHERE ListID = ?");
    $stmt->bind_param("i", $data['id']);
    if (!$stmt->execute()) {
        throw new Exception("Error clearing existing products: " . $stmt->error);
    }

    // Add new products
    $stmt = $conn->prepare("INSERT INTO ListItems (ListID, ProductName, Price, Quantity) VALUES (?, ?, ?, ?)");
    foreach ($data['products'] as $product) {
        $stmt->bind_param("isdi", $data['id'], $product['name'], $product['price'], $product['quantity']);
        if (!$stmt->execute()) {
            throw new Exception("Error adding product: " . $stmt->error);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();