<?php
require_once 'database/config.php';

$productName = $_GET['productName'];

$stmt = $conn->prepare("SELECT * FROM groceryitem WHERE ProductName = ?");
$stmt->bind_param("s", $productName);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if ($product) {
    echo json_encode(['success' => true, 'product' => $product]);
} else {
    echo json_encode(['success' => false, 'error' => 'Product not found']);
}

$stmt->close();
$conn->close();