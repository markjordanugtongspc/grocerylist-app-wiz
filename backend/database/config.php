<?php
$servername = "localhost:4306"; // Adjust port if needed
$username = "root";
$password = "";
$dbname = "grocery_list_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
