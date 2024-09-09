<?php
session_start();
require_once 'database/config.php';

if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$category = isset($_GET['category']) ? $_GET['category'] : '';

$stmt = $conn->prepare("SELECT ProductName, Brand, Price, WeightVolume, Store, Category, ImageURL FROM groceryitem WHERE Category = ?");
$stmt->bind_param("s", $category);
$stmt->execute();
$result = $stmt->get_result();
$products = $result->fetch_all(MYSQLI_ASSOC);

$stmt->close();
$conn->close();

echo json_encode($products);