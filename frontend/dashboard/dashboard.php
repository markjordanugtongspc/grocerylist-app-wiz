<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../../index.php?error=please%login%first");
    exit();
}

// Fetch the user's lists from the database
require_once '../../backend/database/config.php';
$username = $_SESSION['username'];

// First, get the UserID
$stmt = $conn->prepare("SELECT UserID FROM Users WHERE Username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    die("User not found");
}

$userId = $user['UserID'];

// Now fetch the grocery lists for this user
// Remove the ORDER BY clause for now
$stmt = $conn->prepare("SELECT * FROM GroceryList WHERE UserID = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$lists = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="styles/dashboard_style.css" />
    <link rel="icon" href="../../images/grocery.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <title>Dashboard</title>
</head>
<body>
    <div class="container">
    <div class="dashboard <?php echo !empty($lists) ? 'has-lists' : ''; ?>">
    <div class="header">
        <div class="hamburger">☰</div>
        <div class="text-wrapper">Grocery List</div>
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
            <button class="sidebar-btn" id="addProductsBtn"><i class="fas fa-list"></i> Add Products</button>
            <button class="sidebar-btn"><i class="fas fa-history"></i> History</button>
            <button class="sidebar-btn"><i class="fas fa-star"></i> Favorites</button>
            <button class="sidebar-btn"><i class="fas fa-bell"></i> Notifications</button>
            <button id="settingsBtn" class="sidebar-btn"><i class="fas fa-cog"></i> Settings</button>
            <button class="sidebar-btn"><i class="fas fa-question-circle"></i> Help</button>
            <a href="../../backend/logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
        <div class="content" id="listContent">
            <div class="content-wrapper">
                <?php if (empty($lists)): ?>
                    <img src="../../images/dashboard/image-1.png" alt="Background 1" class="image-1">
                    <img src="../../images/dashboard/image-2.png" alt="Background 2" class="image-2">
                    <img src="../../images/dashboard/image.png" alt="Center Image" class="image">
                    <div class="text-wrapper-2">Your List is Empty</div>
                    <p class="p">Create a list and add items to your trolley for an easier grocery experience</p>
                    <a href="addlist.php" class="rectangle">Add List</a>
                <?php else: ?>
                    <div class="list-container">
                        <?php foreach ($lists as $list): ?>
                            <div class="list-item clickable" data-id="<?php echo $list['ListID']; ?>" onclick="viewList(<?php echo $list['ListID']; ?>)">
                                <h3><?php echo htmlspecialchars($list['ListName']); ?></h3>
                                <p>Due: <?php echo $list['DueDate']; ?></p>
                                <p class="priority">
                                    <span class="priority-circle <?php echo strtolower($list['Priority']); ?>"></span>
                                    Priority: <?php echo ucfirst($list['Priority']); ?>
                                </p>
                                <?php if ($list['IsDefault']): ?>
                                    <span class="default-badge">Default</span>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <a href="addlist.php" class="rectangle">Add New List</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <!-- Add this at the end of the body tag -->
<div id="settingsModal" class="modal">
    <div class="modal-content settings-modal">
        <span class="close">&times;</span>
        <h2>Profile Settings</h2>
        <form id="settingsForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="newUsername">New Username</label>
                <input type="text" id="newUsername" name="newUsername" required class="form-control" placeholder="Enter new username">
            </div>
            <div class="form-group">
                <label for="newAvatar">New Avatar</label>
                <div class="file-input-wrapper">
                    <input type="file" id="newAvatar" name="newAvatar" accept="image/*" class="file-input">
                    <label for="newAvatar" class="file-input-label">
                        <i class="fas fa-cloud-upload-alt"></i> Choose File
                    </label>
                    <span class="file-name">No file chosen</span>
                </div>
            </div>
            <button type="submit" class="btn-submit">Save Changes</button>
        </form>
    </div>
</div>
    <script src="scripts/dashboard_script.js"></script>
    <!-- Add this just before the closing </body> tag -->
<div id="listModal" class="modal">
    <div class="modal-content list-edit-modal">
        <span class="close">&times;</span>
        <h2 id="modalTitle">Edit List</h2>
        <div class="list-edit-container">
            <div class="list-details">
                <input type="text" id="listName" placeholder="List Name">
                <input type="date" id="listDueDate">
                <select id="listPriority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="product-categories">
                <button class="category-btn active" data-category="Fruits">Fruits</button>
                <button class="category-btn" data-category="Vegetables">Vegetables</button>
                <button class="category-btn" data-category="Other">Other</button>
                <button class="category-btn" data-category="Other">Other</button>
            </div>
            <div id="productList" class="product-list"></div>
            <div id="selectedProducts" class="selected-products">
                <h3>Selected Products</h3>
            </div>
        </div>
        <button id="saveListBtn">Save List</button>
    </div>
</div>
    <!-- Add this before the closing </body> tag -->
<div id="viewListModal" class="modal">
    <div class="modal-content view-list-modal">
        <span class="close">&times;</span>
        <h2 id="viewListTitle"></h2>
        <p id="viewListDueDate"></p>
        <p id="viewListPriority"></p>
        <h3>Selected Products:</h3>
        <ul id="viewListProducts"></ul>
        <button id="editProductsBtn">Edit Products</button>
        <button id="deleteListBtn">Delete List</button>
    </div>
</div>
</div>

<!-- Add this just before the closing </body> tag -->
<div id="addProductModal" class="modal">
    <div class="modal-content add-product-modal">
        <span class="close">&times;</span>
        <h2>Add New Product</h2>
        <form id="addProductForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="productName">Product Name</label>
                <input type="text" id="productName" name="productName" required class="form-control">
            </div>
            <div class="form-group">
                <label for="productBrand">Brand</label>
                <input type="text" id="productBrand" name="productBrand" class="form-control">
            </div>
            <div class="form-group">
                <label for="productPrice">Price</label>
                <input type="number" id="productPrice" name="productPrice" step="0.01" required class="form-control">
            </div>
            <div class="form-group">
                <label for="productWeightVolume">Weight/Volume</label>
                <input type="text" id="productWeightVolume" name="productWeightVolume" class="form-control">
            </div>
            <div class="form-group">
                <label for="productQuantity">Quantity</label>
                <input type="number" id="productQuantity" name="productQuantity" required class="form-control">
            </div>
            <div class="form-group">
                <label for="productStore">Store</label>
                <input type="text" id="productStore" name="productStore" class="form-control">
            </div>
            <div class="form-group">
                <label for="productCategory">Category</label>
                <select id="productCategory" name="productCategory" required class="form-control">
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="productImage">Product Image</label>
                <div class="file-input-wrapper">
                    <input type="file" id="productImage" name="productImage" accept="image/*" class="file-input">
                    <label for="productImage" class="file-input-label">
                        <i class="fas fa-cloud-upload-alt"></i> Choose File
                    </label>
                    <span class="file-name">No file chosen</span>
                </div>
            </div>
            <button type="submit" class="btn-submit">Add Product</button>
        </form>
    </div>
</div>
<!-- Add this just before the closing </body> tag -->
<div id="editListModal" class="modal">
    <div class="modal-content edit-list-modal">
        <span class="close">&times;</span>
        <h2 id="editListTitle">Edit List: <span id="listName"></span></h2>
        <div class="category-buttons">
            <button class="category-btn" data-category="Fruits">Fruits</button>
            <button class="category-btn" data-category="Vegetables">Vegetables</button>
            <button class="category-btn" data-category="Other">Other</button>
        </div>
        <div id="productList"></div>
        <div id="selectedProducts"></div>
        <button id="saveListBtn">Save List</button>
    </div>
</div>

<!-- Add this new modal for updated list -->
<div id="updatedListModal" class="modal">
    <div class="modal-content updated-list-modal">
        <span class="close">&times;</span>
        <h2>Grocery List Updated</h2>
        <p>Your grocery list has been successfully updated.</p>
        <button id="closeUpdatedListModal">Close</button>
    </div>
</div>

<div id="selectedProductsModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeSelectedProductsModal()">&times;</span>
        <h2>Selected Products</h2>
        <ul id="selectedProductsList"></ul>
    </div>
</div>

<script src="scripts/dashboard_script.js"></script>
</body>
</html>
