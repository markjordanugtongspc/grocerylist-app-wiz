<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // If not logged in, redirect to the login page with an error message
    header("Location: ../../index.php?error=please%login%first");
    exit();
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
    <div class="dashboard">
        <div class="header">
            <a href="dashboard.php" class="back-arrow"><i class="fas fa-arrow-left"></i></a>
            <h1>Create New List</h1>
            <a href="#" class="search-icon"><i class="fas fa-search"></i></a>
        </div>
        <div class="content">
            <form id="addListForm">
                <div class="form-group">
                    <label for="list-name">List Name</label>
                    <input type="text" id="list-name" placeholder="Enter list name" required>
                </div>
                <div class="form-group">
                    <label for="due-date">Due Date</label>
                    <input type="date" id="due-date" required>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <div class="priority-options">
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
                        Make it default
                    </label>
                </div>
                <div class="button-group">
                    <button type="submit" class="btn-primary">Create List</button>
                    <button type="reset" class="btn-secondary">Clear</button>
                </div>
            </form>
        </div>
    </div>
    <script src="scripts/addlist_script.js"></script>
</body>
</html>
