<?php
session_start();
header('Content-Type: application/json');
require_once 'database/config.php';

// Extract category path from POST data
$categoryPath = $_POST['categoryPath'];

// Use this path for image upload
$target_dir = $categoryPath;

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

try {
    $oldProductName = $_POST['oldProductName'];
    $productName = $_POST['productName'];
    $brand = $_POST['brand'];
    $price = $_POST['price'];
    $weightVolume = $_POST['weightVolume'];
    $quantity = $_POST['quantity'];
    $store = $_POST['store'];
    $category = $_POST['category'];
    $categoryLower = strtolower($category);

    // Handle image upload
$imageURL = null;
if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] == 0) {
    $target_dir = "../../images/products/" . $categoryLower . "/";
    
    // Ensure the directory exists
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
            throw new Exception("Failed to create directory: $target_dir");
        }
    }

    // Sanitize the file name
    $fileName = basename($_FILES["productImage"]["name"]);
    $fileName = preg_replace("/[^a-zA-Z0-9\._-]/", "", $fileName);
    $target_file = $target_dir . $fileName;

    // Validate image
    $check = getimagesize($_FILES["productImage"]["tmp_name"]);
    if ($check === false) {
        throw new Exception("File is not an image.");
    }

    // Validate file size
    if ($_FILES["productImage"]["size"] > 5000000) {
        throw new Exception("Sorry, your file is too large.");
    }

    // Validate file type
    $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    if (!in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
        throw new Exception("Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
    }

    // Delete old image if it exists
    $stmt = $conn->prepare("SELECT ImageURL FROM groceryitem WHERE ProductName = ?");
    $stmt->bind_param("s", $oldProductName);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImageURL = $row['ImageURL'];
        if ($oldImageURL && file_exists($oldImageURL)) {
            unlink($oldImageURL);
        }
    }

    // Move the uploaded file
    if (!move_uploaded_file($_FILES["productImage"]["tmp_name"], $target_file)) {
        throw new Exception("Sorry, there was an error uploading your file.");
    }
    $imageURL = $target_file; // Set the new image URL
}


    // Prepare the SQL statement for updating the product
    $stmt = $conn->prepare("UPDATE groceryitem SET ProductName = ?, Brand = ?, Price = ?, WeightVolume = ?, Quantity = ?, Store = ?, Category = ?" . ($imageURL ? ", ImageURL = ?" : "") . " WHERE ProductName = ?");
    
    if ($imageURL) {
        $stmt->bind_param("ssdsissss", $productName, $brand, $price, $weightVolume, $quantity, $store, $category, $imageURL, $oldProductName);
    } else {
        $stmt->bind_param("ssdsisss", $productName, $brand, $price, $weightVolume, $quantity, $store, $category, $oldProductName);
    }

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
