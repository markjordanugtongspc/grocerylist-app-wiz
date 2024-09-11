<?php
session_start();
require_once 'database/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$listId = intval($_GET['listId']);

$stmt = $conn->prepare("
    SELECT 
        sp.ProductName, 
        sp.Quantity, 
        sp.IsPurchased,
        COALESCE(gi.Brand, '') AS Brand, 
        COALESCE(gi.WeightVolume, '') AS WeightVolume, 
        COALESCE(gi.Store, '') AS Store,
        COALESCE(gi.Price, 0) AS Price
    FROM 
        selectedproducts sp
    LEFT JOIN 
        groceryitem gi ON sp.ProductName = gi.ProductName
    WHERE 
        sp.ListID = ?
");
$stmt->bind_param("i", $listId);
$stmt->execute();
$result = $stmt->get_result();
$products = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'products' => $products]);
$stmt->close();
$conn->close();