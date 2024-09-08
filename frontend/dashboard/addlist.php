<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // If not logged in, redirect to the login page with an error message
    header("Location: ../../index.php?error=Please%20Login%20First");
    exit();
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="../../frontend/dashboard/addlist_style.css" />
        <title>Dashboard</title>
    </head>
    <body>
        <div class="dashboard">
            <div class="header">
                <h1>Shopping List</h1>
            </div>
            <div class="content">
                <form>
                    <div class="form-group">
                        <label for="list-name">Add List Name</label>
                        <input type="text" id="list-name" placeholder="Weekend List">
                    </div>
                    <div class="form-group">
                        <label for="due-date">Due Date</label>
                        <input type="date" id="due-date" value="2018-12-08">
                    </div>
                    <div class="form-group">
                        <label>Set Priority</label>
                        <div class="priority-options">
                            <label><input type="radio" name="priority" value="high"> High</label>
                            <label><input type="radio" name="priority" value="medium"> Medium</label>
                            <label><input type="radio" name="priority" value="low"> Low</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><input type="checkbox" name="default"> Make it default</label>
                    </div>
                    <div class="button-group">
                        <button type="submit" class="btn-primary">Create List</button>
                        <button type="reset" class="btn-secondary">Clear List</button>
                    </div>
                </form>
            </div>
        </div>
    </body>
</html>
