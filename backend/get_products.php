<?php
session_start();
require_once 'database/config.php'; // Include database configuration

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    http_response_code(401); // Set HTTP response code for unauthorized access
    echo json_encode(['error' => 'User not logged in']); // Return error message
    exit; // Stop further execution
}

// Get the category from the query parameters
$category = isset($_GET['category']) ? $_GET['category'] : ''; // Use an empty string if not set

// Prepare SQL statement to fetch products by category
$stmt = $conn->prepare("SELECT ProductName, Brand, Price, WeightVolume, Store, Category, ImageURL FROM groceryitem WHERE Category = ?");
$stmt->bind_param("s", $category); // Bind category parameter
$stmt->execute(); // Execute the query
$result = $stmt->get_result(); // Get the result set
$products = $result->fetch_all(MYSQLI_ASSOC); // Fetch all products as an associative array

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection

echo json_encode($products); // Return the products as a JSON response
?>