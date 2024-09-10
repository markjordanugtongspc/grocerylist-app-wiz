<?php
session_start();
require_once 'database/config.php'; // Include database configuration

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'error' => '']; // Initialize response array

    // Check if user is logged in
    if (!isset($_SESSION['username'])) {
        $response['error'] = 'User not logged in'; // Set error message
        echo json_encode($response); // Return error response
        exit; // Stop further execution
    }

    // Get form data from the request
    $productName = $_POST['productName'];
    $brand = $_POST['productBrand'];
    $price = $_POST['productPrice'];
    $weightVolume = $_POST['productWeightVolume'];
    $quantity = $_POST['productQuantity'];
    $store = $_POST['productStore'];
    $category = $_POST['productCategory'];

    // Handle file upload for product image
    $imageURL = ''; // Initialize image URL
    if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../images/products/'; // Directory for uploaded images
        $categoryDir = strtolower($category) . '/'; // Subdirectory for category
        $fileName = $_SESSION['username'] . '_' . time() . '_' . $_FILES['productImage']['name']; // Create unique file name
        $uploadPath = $uploadDir . $categoryDir . $fileName; // Full path to upload

        // Create category directory if it doesn't exist
        if (!file_exists($uploadDir . $categoryDir)) {
            mkdir($uploadDir . $categoryDir, 0777, true); // Create directory with permissions
        }

        // Move the uploaded file to the designated path
        if (move_uploaded_file($_FILES['productImage']['tmp_name'], $uploadPath)) {
            $imageURL = '../../images/products/' . $categoryDir . $fileName; // Set image URL
        } else {
            $response['error'] = 'Failed to upload image'; // Set error message for upload failure
            echo json_encode($response); // Return error response
            exit; // Stop further execution
        }
    }

    // Insert product data into the database
    $stmt = $conn->prepare("INSERT INTO groceryitem (ProductName, Brand, Price, WeightVolume, Quantity, Store, Category, ImageURL, DateAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssdsssss", $productName, $brand, $price, $weightVolume, $quantity, $store, $category, $imageURL); // Bind parameters

    if ($stmt->execute()) {
        $response['success'] = true; // Set success response
    } else {
        $response['error'] = 'Failed to add product to database'; // Set error message
    }

    $stmt->close(); // Close the statement
    $conn->close(); // Close the database connection

    echo json_encode($response); // Return response
} else {
    http_response_code(405); // Set HTTP response code for method not allowed
    echo json_encode(['error' => 'Method Not Allowed']); // Return error message
}