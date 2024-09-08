<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../../index.php?error=please%20login%20first");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/dashboard_style.css" />
    <link rel="icon" href="../../images/grocery.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <title>Dashboard</title>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <div class="hamburger">☰</div>
        </div>
        <div class="sidebar">
            <div class="user-profile">
                <div class="avatar-container">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="nameplate">
                    <p id="usernameDisplay"><?php echo $_SESSION['username']; ?></p>
                </div>
            </div>
            <button class="sidebar-btn"><i class="fas fa-home"></i> Home</button>
            <button class="sidebar-btn"><i class="fas fa-list"></i> My Lists</button>
            <button class="sidebar-btn"><i class="fas fa-history"></i> History</button>
            <button class="sidebar-btn"><i class="fas fa-star"></i> Favorites</button>
            <button class="sidebar-btn"><i class="fas fa-bell"></i> Notifications</button>
            <button id="settingsBtn" class="sidebar-btn"><i class="fas fa-cog"></i> Settings</button>
            <button class="sidebar-btn"><i class="fas fa-question-circle"></i> Help</button>
            <a href="../../backend/logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
        <div class="content">
            <img class="image-1" src="../../images/dashboard/image-1.png" alt="Background Image 1" />
            <img class="image-2" src="../../images/dashboard/image-2.png" alt="Background Image 2" />
            <img class="image" src="../../images/dashboard/image.png" alt="Main Dashboard Image" />
            <img class="image-3" src="../../images/dashboard/image-3.png" alt="Corner Image Left" />
            <img class="image-4" src="../../images/dashboard/image-4.png" alt="Corner Image Right" />
            <div class="text-wrapper">Grocery List</div>
            <div class="text-wrapper-2">Your List is Empty</div>
            <p class="p">Create a list and add items to your trolley for an easier grocery experience</p>
            <button class="rectangle"><a href="../dashboard/addlist.php" style="text-decoration: none; color: inherit;">Add List</a></button>
        </div>
    </div>
    <!-- Add this at the end of the body tag -->
<div id="settingsModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Profile Settings</h2>
        <form id="settingsForm" enctype="multipart/form-data">
            <label for="newUsername">New Username:</label>
            <input type="text" id="newUsername" name="newUsername" required>
            <label for="newAvatar">New Avatar:</label>
            <input type="file" id="newAvatar" name="newAvatar" accept="image/*">
            <button type="submit">Save Changes</button>
        </form>
    </div>
</div>
    <script src="scripts/dashboard_script.js"></script>
</body>
</html>
