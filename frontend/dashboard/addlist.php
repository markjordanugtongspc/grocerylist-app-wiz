<?php
session_start();

// Check if the user is logged in; redirect to login page if not
if (!isset($_SESSION['username'])) {
    header("Location: ../../index.php?error=please%login%first");
    exit(); // Stop script execution after redirect
}

if ($_SERVER["REQUEST_METHOD"] == "POST") { // Check if the form is submitted
    $configPath = __DIR__ . '/../../backend/database/config.php';
    // Check if the database configuration file exists
    if (file_exists($configPath)) {
        require_once $configPath; // Include configuration
    } else {
        die("Config file not found. Looked in: " . $configPath); // Stop if config is missing
    }

    $username = $_SESSION['username']; // Get the logged-in username
    $list_name = trim($_POST['list-name']); // Get and trim list name input
    $due_date = !empty($_POST['due-date']) ? $_POST['due-date'] : '2024-09-06'; // Get due date or set default
    $priority = $_POST['priority']; // Get selected priority
    $is_default = isset($_POST['default']) ? 1 : 0; // Check if 'default' checkbox is checked

    // Validate that all fields are filled
    if (empty($list_name) || empty($due_date) || empty($priority)) {
        echo json_encode(['success' => false, 'error' => 'All fields are required.']); // Return error response
    } else {
        // Get UserID based on the logged-in username
        $stmt = $conn->prepare("SELECT UserID FROM Users WHERE Username = ?");
        $stmt->bind_param("s", $username); // Bind username parameter
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        // Check if user was found
        if (!$user) {
            echo json_encode(['success' => false, 'error' => 'User not found.']); // Return error response
            exit(); // Stop further execution
        }

        $userId = $user['UserID']; // Store the UserID for later use

        // Insert new grocery list into the database
        $stmt = $conn->prepare("INSERT INTO GroceryList (UserID, ListName, DueDate, Priority, IsDefault, DateCreated, LastModified) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("isssi", $userId, $list_name, $due_date, $priority, $is_default); // Bind parameters

        // Execute the insert statement and check for success
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'List created successfully!']); // Success response
        } else {
            echo json_encode(['success' => false, 'error' => 'Error creating list: ' . $conn->error]); // Error response
        }

        $stmt->close(); // Close the statement
    }
    $conn->close(); // Close the database connection
    exit(); // Stop script execution
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/addlist_style.css" />
    <link rel="icon" href="../../images/grocery.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <title>Add List</title>
</head>

<body>
    <div class="container">
        <div class="dashboard">
            <div class="header">
                <a href="dashboard.php" class="back-arrow"><i class="fas fa-arrow-left"></i></a> <!-- Back to dashboard link -->
                <h1>Create New List</h1> <!-- Page title -->
            </div>
            <div class="content">
                <form id="addListForm" method="POST" action=""> <!-- Form for adding a new list -->
                    <div class="form-group">
                        <label for="list-name">List Name</label>
                        <input type="text" id="list-name" name="list-name" placeholder="Enter list name" required> <!-- Input for list name -->
                    </div>
                    <div class="form-group">
                        <label for="due-date">Due Date</label>
                        <input type="date" id="due-date" name="due-date" required> <!-- Input for due date -->
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <div class="priority-options"> <!-- Priority selection options -->
                            <label class="priority-label high">
                                <input type="radio" name="priority" value="high" required>
                                <span class="priority-color"></span>
                                High
                            </label>
                            <label class="priority-label medium">
                                <input type="radio" name="priority" value="medium">
                                <span class="priority-color"></span>
                                Medium
                            </label>
                            <label class="priority-label low">
                                <input type="radio" name="priority" value="low">
                                <span class="priority-color"></span>
                                Low
                            </label>
                        </div>
                    </div>
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="default">
                            Make it default <!-- Checkbox for setting as default list -->
                        </label>
                    </div>
                    <div class="button-group">
                        <button type="submit" class="btn-primary">Create List</button> <!-- Submit button -->
                        <button type="reset" class="btn-secondary">Clear</button> <!-- Reset button -->
                    </div>
                </form>
                <div id="successPopup" class="success-popup">
                    <p id="successMessage" class="success-message"></p> <!-- Popup message for success feedback -->
                </div>
            </div>
        </div>
    </div>
    <script src="scripts/addlist_script.js"></script> <!-- Link to JavaScript file -->
    <script>
        // Add this script to apply the theme immediately when the page loads
        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
        }

        const savedTheme = getCookie('theme') || 'light';
        applyTheme(savedTheme);
    </script>
</body>

</html>