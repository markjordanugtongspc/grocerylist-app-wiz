<?php
session_start();
require_once 'database/config.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

if (!isset($_GET['listId'])) {
    echo json_encode(['success' => false, 'error' => 'List ID not provided']);
    exit();
}

$listId = $_GET['listId'];

try {
    // Fetch list details
    $stmt = $conn->prepare("SELECT * FROM GroceryList WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("is", $listId, $_SESSION['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    $list = $result->fetch_assoc();

    if (!$list) {
        echo json_encode(['success' => false, 'error' => 'List not found']);
        exit();
    }

    // Fetch products for this list
    $stmt = $conn->prepare("SELECT * FROM groceryitem WHERE ListID = ?");
    $stmt->bind_param("i", $listId);
    $stmt->execute();
    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);

    $list['products'] = $products;

    echo json_encode(['success' => true, 'list' => $list]);
} catch (Exception $e) {
    error_log('Error in get_list_details.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();