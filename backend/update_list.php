<?php
session_start();
require_once 'database/config.php'; // Include database configuration

header('Content-Type: application/json'); // Set response type to JSON

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']); // Return error if not logged in
    exit(); // Stop further execution
}

// Decode the JSON input from the request body
$input = json_decode(file_get_contents('php://input'), true);

// Ensure all required fields are provided
if (!isset($input['id']) || !isset($input['name']) || !isset($input['dueDate']) || !isset($input['priority']) || !isset($input['products'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']); // Return error if fields are missing
    exit(); // Stop further execution
}

// Extract data from the input
$listId = $input['id'];
$listName = $input['name'];
$dueDate = $input['dueDate'];
$priority = $input['priority'];
$products = $input['products'];

// Convert the due date to MySQL datetime format
$formattedDueDate = date('Y-m-d H:i:s', strtotime($dueDate));

$conn->begin_transaction(); // Start a database transaction

try {
    // Update the list details in the database
    $stmt = $conn->prepare("UPDATE grocerylist SET ListName = ?, DueDate = ?, Priority = ?, LastModified = NOW() WHERE ListID = ? AND UserID = (SELECT UserID FROM Users WHERE Username = ?)");
    $stmt->bind_param("sssss", $listName, $formattedDueDate, $priority, $listId, $_SESSION['username']);
    $stmt->execute();

    // Delete existing products for this list
    $stmt = $conn->prepare("DELETE FROM selectedproducts WHERE ListID = ?");
    $stmt->bind_param("i", $listId);
    $stmt->execute();

    // Insert new products into the database
    $stmt = $conn->prepare("INSERT INTO selectedproducts (ListID, ProductName, Quantity) VALUES (?, ?, ?)");
    foreach ($products as $product) {
        $productName = $product['name']; // Get product name
        $quantity = $product['quantity']; // Get product quantity
        $stmt->bind_param("isi", $listId, $productName, $quantity); // Bind parameters
        $stmt->execute(); // Execute insert for each product
    }

    $conn->commit(); // Commit the transaction
    echo json_encode(['success' => true]); // Return success response
} catch (Exception $e) {
    $conn->rollback(); // Rollback the transaction on error
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]); // Return error response
}

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection
