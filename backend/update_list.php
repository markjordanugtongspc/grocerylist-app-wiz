<?php
session_start();
require_once 'database/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id']) || !isset($input['name']) || !isset($input['dueDate']) || !isset($input['priority']) || !isset($input['products'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit();
}

$listId = $input['id'];
$listName = $input['name'];
$dueDate = $input['dueDate'];
$priority = $input['priority'];
$products = $input['products'];

// Convert the date to MySQL datetime format
$formattedDueDate = date('Y-m-d H:i:s', strtotime($dueDate));

$conn->begin_transaction();

try {
    // Update the list details
    $stmt = $conn->prepare("UPDATE grocerylist SET ListName = ?, DueDate = ?, Priority = ?, LastModified = NOW() WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("sssss", $listName, $formattedDueDate, $priority, $listId, $_SESSION['username']);
    $stmt->execute();

    // Delete existing products for this list
    $stmt = $conn->prepare("DELETE FROM selectedproducts WHERE ListID = ?");
    $stmt->bind_param("i", $listId);
    $stmt->execute();

    // Insert new products
    $stmt = $conn->prepare("INSERT INTO selectedproducts (ListID, ProductName, Quantity) VALUES (?, ?, ?)");
    foreach ($products as $product) {
        $productName = $product['name'];
        $quantity = $product['quantity'];
        $stmt->bind_param("isi", $listId, $productName, $quantity);
        $stmt->execute();
    }

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>