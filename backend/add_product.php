<?php
session_start();
require_once 'database/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'error' => ''];

    // Check if user is logged in
    if (!isset($_SESSION['username'])) {
        $response['error'] = 'User not logged in';
        echo json_encode($response);
        exit;
    }

    // Get form data
    $productName = $_POST['productName'];
    $brand = $_POST['productBrand'];
    $price = $_POST['productPrice'];
    $weightVolume = $_POST['productWeightVolume'];
    $quantity = $_POST['productQuantity'];
    $store = $_POST['productStore'];
    $category = $_POST['productCategory'];

    // Handle file upload
    $imageURL = '';
    if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../images/products/';
        $categoryDir = strtolower($category) . '/';
        $fileName = $_SESSION['username'] . '_' . time() . '_' . $_FILES['productImage']['name'];
        $uploadPath = $uploadDir . $categoryDir . $fileName;

        if (!file_exists($uploadDir . $categoryDir)) {
            mkdir($uploadDir . $categoryDir, 0777, true);
        }

        if (move_uploaded_file($_FILES['productImage']['tmp_name'], $uploadPath)) {
            $imageURL = '../../images/products/' . $categoryDir . $fileName;
        } else {
            $response['error'] = 'Failed to upload image';
            echo json_encode($response);
            exit;
        }
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO groceryitem (ProductName, Brand, Price, WeightVolume, Quantity, Store, Category, ImageURL, DateAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssdsssss", $productName, $brand, $price, $weightVolume, $quantity, $store, $category, $imageURL);

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Failed to add product to database';
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}