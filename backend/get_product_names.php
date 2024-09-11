<?php
require_once 'database/config.php';

$stmt = $conn->prepare("SELECT DISTINCT ProductName FROM groceryitem ORDER BY ProductName");
$stmt->execute();
$result = $stmt->get_result();
$products = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($products);

$stmt->close();
$conn->close();