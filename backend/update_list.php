<?php
// Turn off error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Start output buffering
ob_start();

session_start();
require_once 'database/config.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Function to return JSON response
function sendJsonResponse($success, $message = '', $data = null) {
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data
    ];
    echo json_encode($response);
    ob_end_flush();
    exit;
}

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    sendJsonResponse(false, 'Not logged in');
}

// Decode the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['id']) || !isset($input['name']) || !isset($input['dueDate']) || !isset($input['priority']) || !isset($input['products'])) {
    sendJsonResponse(false, 'Missing required fields');
}

// Extract data
$listId = $input['id'];
$listName = $input['name'];
$dueDate = $input['dueDate'];
$priority = $input['priority'];
$products = $input['products'];

// Validate data types and formats here if needed

try {
    $conn->begin_transaction();

    // Update list details
    $stmt = $conn->prepare("UPDATE grocerylist SET ListName = ?, DueDate = ?, Priority = ?, LastModified = NOW() WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("sssss", $listName, $dueDate, $priority, $listId, $_SESSION['username']);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        throw new Exception("No list updated. Check if the list exists and belongs to the current user.");
    }

    // Delete existing products
    $stmt = $conn->prepare("DELETE FROM selectedproducts WHERE ListID = ?");
    $stmt->bind_param("i", $listId);
    $stmt->execute();

    // Insert new products
    $stmt = $conn->prepare("INSERT INTO selectedproducts (ListID, ProductName, Quantity) VALUES (?, ?, ?)");
    foreach ($products as $product) {
        $stmt->bind_param("isi", $listId, $product['name'], $product['quantity']);
        if (!$stmt->execute()) {
            throw new Exception("Error inserting product: " . $stmt->error);
        }
    }

    $conn->commit();
    sendJsonResponse(true, 'List updated successfully');
} catch (Exception $e) {
    $conn->rollback();
    sendJsonResponse(false, 'Database error: ' . $e->getMessage());
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}