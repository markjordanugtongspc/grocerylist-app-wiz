<?php
require_once 'database/config.php';

$stmt = $conn->prepare("SELECT DISTINCT Store FROM groceryitem WHERE Store IS NOT NULL AND Store != '' ORDER BY Store");
$stmt->execute();
$result = $stmt->get_result();
$stores = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(array_column($stores, 'Store'));

$stmt->close();
$conn->close();