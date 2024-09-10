<?php
session_start();

// Check if the user is logged in; redirect to login page if not
if (!isset($_SESSION["username"])) {
    header("Location: ../../index.php?error=please%login%first");
    exit(); // Stop script execution after redirect
}

// Require database configuration
require_once "../../backend/database/config.php";
$username = $_SESSION["username"];

// Prepare SQL statement to get the UserID based on the logged-in username
$stmt = $conn->prepare("SELECT UserID FROM Users WHERE Username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close(); // Close the statement

// Check if user exists
if (!$user) {
    die("User not found"); // Stop script execution if user is not found
}

$userId = $user["UserID"]; // Store the UserID for later use

// Fetch grocery lists for the user from the database
$stmt = $conn->prepare("SELECT * FROM GroceryList WHERE UserID = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$lists = $result->fetch_all(MYSQLI_ASSOC); // Fetch all lists associated with the user
$stmt->close(); // Close the statement
$conn->close(); // Close the database connection
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
    <title>Dashboard</title>
</head>

<body>
    <div class="container">
        <div class="dashboard <?php echo !empty($lists) ? 'has-lists' : ''; ?>">
            <div id="messagePopup" class="message-popup">
                <p id="popupMessage"></p> <!-- Message display for user feedback -->
            </div>
            <div class="header">
                <div class="hamburger">☰</div> <!-- Hamburger icon for sidebar -->
                <div class="text-wrapper">Grocery List</div>
            </div>
            <div class="sidebar">
                <div class="user-profile">
                    <div class="avatar-container">
                        <i class="fas fa-user-circle"></i> <!-- User avatar icon -->
                    </div>
                    <div class="nameplate">
                        <p id="usernameDisplay"><?php echo $_SESSION['username']; ?></p> <!-- Display logged-in username -->
                    </div>
                </div>
                <!-- Sidebar navigation buttons -->
                <button class="sidebar-btn"><i class="fas fa-home"></i> Home</button>
                <button class="sidebar-btn" id="addProductsBtn"><i class="fas fa-list"></i> Add Products</button>
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
                        <!-- Message for empty list state -->
                        <img src="../../images/dashboard/image-1.png" alt="Background 1" class="image-1">
                        <img src="../../images/dashboard/image-2.png" alt="Background 2" class="image-2">
                        <img src="../../images/dashboard/image.png" alt="Center Image" class="image">
                        <div class="text-wrapper-2">Your List is Empty</div>
                        <p class="p">Create a list and add items to your trolley for an easier grocery experience</p>
                        <a href="addlist.php" class="rectangle">Add List</a> <!-- Link to add a new list -->
                    <?php else: ?>
                        <div class="list-container">
                            <?php foreach ($lists as $list): ?>
                                <!-- List item that is clickable to view details -->
                                <div class="list-item clickable" data-id="<?php echo $list['ListID']; ?>" onclick="viewList(<?php echo $list['ListID']; ?>)">
                                    <h3><?php echo htmlspecialchars($list['ListName']); ?></h3> <!-- Display list name -->
                                    <p>Due: <?php echo $list['DueDate']; ?></p> <!-- Display due date -->
                                    <p class="priority">
                                        <span class="priority-circle <?php echo strtolower($list['Priority']); ?>"></span>
                                        Priority: <?php echo ucfirst($list['Priority']); ?> <!-- Display priority level -->
                                    </p>
                                    <?php if ($list['IsDefault']): ?>
                                        <span class="default-badge">Default</span> <!-- Indicate if this is a default list -->
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <a href="addlist.php" class="rectangle">Add New List</a> <!-- Link to add a new grocery list -->
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Modal for profile settings -->
        <div id="settingsModal" class="modal">
            <div class="modal-content settings-modal">
                <span class="close">&times;</span> <!-- Close button -->
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

        <!-- Modal for editing a grocery list -->
        <div id="listModal" class="modal">
            <div class="modal-content list-edit-modal">
                <span class="close">&times;</span> <!-- Close button -->
                <h2 id="modalTitle">Edit List</h2>
                <div class="list-edit-container">
                    <div class="list-details">
                        <input type="text" id="listName" placeholder="List Name"> <!-- Input for list name -->
                        <input type="date" id="listDueDate"> <!-- Input for due date -->
                        <select id="listPriority"> <!-- Dropdown for priority selection -->
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="product-categories">
                        <!-- Category buttons for product selection -->
                        <button class="category-btn active" data-category="Fruits">Fruits</button>
                        <button class="category-btn" data-category="Vegetables">Vegetables</button>
                        <button class="category-btn" data-category="Other">Other</button>
                    </div>
                    <div id="productList" class="product-list"></div> <!-- Display area for products -->
                    <div id="selectedProducts" class="selected-products">
                        <h3>Selected Products</h3>
                    </div>
                </div>
                <button id="saveListBtn">Save List</button> <!-- Button to save the edited list -->
            </div>
        </div>

        <!-- Modal for viewing list details -->
        <div id="viewListModal" class="modal">
            <div class="modal-content view-list-modal">
                <span class="close">&times;</span> <!-- Close button -->
                <h2 id="viewListTitle"></h2>
                <p id="viewListDueDate"></p>
                <p id="viewListPriority"></p>
                <h3>Selected Products:</h3>
                <ul id="viewListProducts"></ul> <!-- List of selected products -->
                <button id="editProductsBtn">Edit Products</button> <!-- Button to edit products -->
                <button id="deleteListBtn">Delete List</button> <!-- Button to delete the list -->
            </div>
        </div>

    </div>

    <!-- Modal for adding a new product -->
    <div id="addProductModal" class="modal">
        <div class="modal-content add-product-modal">
            <span class="close">&times;</span> <!-- Close button -->
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
                <button type="submit" class="btn-submit">Add Product</button> <!-- Button to submit new product -->
            </form>
        </div>
    </div>

    <!-- Modal for editing a specific list -->
    <div id="editListModal" class="modal">
        <div class="modal-content edit-list-modal">
            <span class="close">&times;</span> <!-- Close button -->
            <h2 id="editListTitle">Edit List: <span id="listName"></span></h2> <!-- Title showing the list name -->
            <div class="category-buttons">
                <button class="category-btn" data-category="Fruits">Fruits</button>
                <button class="category-btn" data-category="Vegetables">Vegetables</button>
                <button class="category-btn" data-category="Other">Other</button>
            </div>
            <div id="productList"></div> <!-- Display area for products -->
            <div id="selectedProducts"></div> <!-- Area showing selected products -->
            <button id="saveListBtn">Save List</button> <!-- Button to save the edited list -->
        </div>
    </div>

    <!-- Modal for confirming that the grocery list has been updated -->
    <div id="updatedListModal" class="modal">
        <div class="modal-content updated-list-modal">
            <span class="close">&times;</span> <!-- Close button -->
            <h2>Grocery List Updated</h2>
            <p>Your grocery list has been successfully updated.</p>
            <button id="closeUpdatedListModal">Close</button> <!-- Button to close the modal -->
        </div>
    </div>

    <div id="selectedProductsModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeSelectedProductsModal()">&times;</span> <!-- Close button -->
            <h2>Selected Products</h2>
            <ul id="selectedProductsList"></ul> <!-- Display list of selected products -->
        </div>
    </div>

    <script src="scripts/dashboard_script.js"></script>
</body>

</html>