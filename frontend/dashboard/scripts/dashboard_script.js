document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.querySelector('.close');
    const settingsForm = document.getElementById('settingsForm');
    const listModal = document.getElementById('listModal');
    const modalClose = listModal ? listModal.querySelector('.close') : null;
    const productList = document.getElementById('productList');
    const selectedProducts = document.getElementById('selectedProducts');
    const saveListBtn = document.getElementById('saveListBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Event listeners for modal closing
    if (modalClose) {
        modalClose.onclick = function() {
            listModal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target == listModal) {
            listModal.style.display = 'none';
        }
    }

    // Existing event listeners
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    settingsCloseBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    function loadProducts(category) {
        productList.innerHTML = '';
        
       
        const existingProducts = {
            'Fruits': [
                { ProductName: 'Apple', Price: 4.00, ImageURL: '../../images/products/fruits/apple.jpg' },
                { ProductName: 'Banana', Price: 7.00, ImageURL: '../../images/products/fruits/banana.jpg' },
                { ProductName: 'Strawberry', Price: 4.00, ImageURL: '../../images/products/fruits/strawberry.jpg' },
                { ProductName: 'Watermelon', Price: 4.00, ImageURL: '../../images/products/fruits/watermelon.jpg' }
            ],
            'Vegetables': [
                { ProductName: 'Carrot', Price: 30.00, ImageURL: '../../images/products/vegetables/carrot.jpg' },
                { ProductName: 'Broccoli', Price: 40.00, ImageURL: '../../images/products/vegetables/broccoli.jpg' }
            ],
            'Other': [
                { ProductName: 'Canned Beans', Price: 50.00, ImageURL: '../../images/products/other/canned-beans.jpg' },
                { ProductName: 'Pasta', Price: 45.00, ImageURL: '../../images/products/other/pasta.jpg' }
            ]
        };

        // Display existing products
        if (existingProducts[category]) {
            existingProducts[category].forEach(product => {
                displayProduct(product, true);
            });
        }

        // Fetch and display newly added products
        fetch(`../../backend/get_products.php?category=${category}`)
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    if (!existingProducts[category] || !existingProducts[category].some(p => p.ProductName === product.ProductName)) {
                        displayProduct(product, false);
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function displayProduct(product, isExisting) {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.ImageURL || '../../images/products/default.jpg'}" alt="${product.ProductName}">
            <p class="product-name">${product.ProductName}</p>
            <p class="product-price">₱${product.Price ? parseFloat(product.Price).toFixed(2) : 'N/A'}</p>
            ${product.Brand ? `<p class="product-brand">Brand: ${product.Brand}</p>` : ''}
            ${product.WeightVolume ? `<p class="product-weight-volume">Weight/Volume: ${product.WeightVolume}</p>` : ''}
            ${product.Store ? `<p class="product-store">Store: ${product.Store}</p>` : ''}
            <button class="add-to-list-btn">Add</button>
        `;

        productItem.querySelector('.add-to-list-btn').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToSelectedProducts({...product, isExisting: isExisting});
        });

        productList.appendChild(productItem);
    }

    function addToSelectedProducts(product) {
        const selectedProductsList = document.getElementById('selectedProductsList');
        const existingProduct = selectedProductsList.querySelector(`[data-product-name="${product.ProductName}"]`);
    
        if (existingProduct) {
            // If the product already exists, don't do anything
            return;
            // If the product already exists, don't do anything
            return;
        } else {
            // Add new product to the list
            const listItem = document.createElement('li');
            listItem.setAttribute('data-product-name', product.ProductName);
            
            if (product.isExisting) {
                listItem.innerHTML = `
                    <span class="product-name">${product.ProductName} - ₱${parseFloat(product.Price).toFixed(2)}</span>
                    <span class="product-quantity">1x</span>
                    <button class="remove-product" title="Remove">×</button>
                `;
            } else {
                listItem.innerHTML = `
                    <span class="product-name">${product.ProductName} - ₱${parseFloat(product.Price).toFixed(2)} - ${product.Category}</span>
                    <span class="product-quantity">
                        <input type="number" class="product-quantity-input" value="1" min="1" max="999">
                    </span>
                    <button class="remove-product" title="Remove">×</button>
                `;
    
                listItem.querySelector('.product-quantity-input').addEventListener('change', (e) => {
                    if (e.target.value < 1) e.target.value = 1;
                    if (e.target.value > 999) e.target.value = 999;
                    saveListToLocalStorage();
                });
            }
    
            listItem.querySelector('.remove-product').addEventListener('click', () => {
                listItem.remove();
                saveListToLocalStorage();
            });
    
            selectedProductsList.appendChild(listItem);
        }
    
        // Save to local storage after adding a product
        saveListToLocalStorage();
    }

    function saveListToLocalStorage() {
        const listName = document.getElementById('listName').value;
        const listDueDate = document.getElementById('listDueDate').value;
        const listPriority = document.getElementById('listPriority').value;
        const selectedProductsData = Array.from(document.querySelectorAll('#selectedProductsList li')).map(item => {
            const [name, price, category] = item.querySelector('.product-name').textContent.split(' - ');
            return {
                name: name,
                price: price.substring(1), // Remove the ₱ symbol
                category: category || '',
                quantity: item.querySelector('.product-quantity-input') ? item.querySelector('.product-quantity-input').value : 1
            };
        });

        // Check if all required fields are present
        if (!currentListId || !listName || !listDueDate || !listPriority) {
            console.error('Missing required fields');
            return; // Exit the function if required fields are missing
        }

        const listData = {
            id: currentListId,
            name: listName,
            dueDate: listDueDate,
            priority: listPriority,
            products: selectedProductsData
        };

        // Save to local storage
        localStorage.setItem(`groceryList_${currentListId}`, JSON.stringify(listData));

        // Update the database
        updateListInDatabase(listData);
    }

    function updateListInDatabase(listData) {
        console.log('Updating list with data:', listData);
        // Check if all required fields are present
        if (!listData.id || !listData.name || !listData.dueDate || !listData.priority || !listData.products) {
            console.error('Missing required fields in listData');
            return; // Exit the function if required fields are missing
        }

        fetch('../../backend/update_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('List updated successfully in the database');
            } else {
                console.error('Error updating list in the database:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function saveList(e) {
        e.preventDefault(); // Prevent form submission

        const listName = document.getElementById('listName').value;
        const listDueDate = document.getElementById('listDueDate').value;
        const listPriority = document.getElementById('listPriority').value;
        const selectedProducts = Array.from(document.querySelectorAll('#selectedProductsList li')).map(item => {
            const [name, price, category] = item.querySelector('.product-name').textContent.split(' - ');
            return {
                ProductName: name,
                Price: price.substring(1), // Remove the ₱ symbol
                Category: category || '',
                Quantity: item.querySelector('.product-quantity-input') ? item.querySelector('.product-quantity-input').value : 1
            };
        });

        if (!listName || !listDueDate || !listPriority) {

            showErrorMessage('Please fill in all fields');
            return;
        }

        const updatedList = {
            id: currentListId,
            name: listName,
            dueDate: listDueDate,
            priority: listPriority,
            products: selectedProducts
        };

        fetch('../../backend/update_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedList)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage('List updated successfully!');
                document.getElementById('listModal').style.display = 'none';
                setTimeout(() => {
                    location.reload(); // Refresh the page to show updated list
                }, 3000); // Wait for 3 seconds before reloading
            } else {
                showErrorMessage('Error updating list: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An unexpected error occurred. Please try again.');
        });
    }

    // Add event listener for the Save List button
    if (saveListBtn) {
        saveListBtn.addEventListener('click', saveList);
    }

    // Add event listeners for list name, due date, and priority inputs
    document.getElementById('listName').addEventListener('change', saveListToLocalStorage);
    document.getElementById('listDueDate').addEventListener('change', saveListToLocalStorage);
    document.getElementById('listPriority').addEventListener('change', saveListToLocalStorage);

    // Category button event listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProducts(btn.dataset.category === 'Processed Foods' ? 'Other' : btn.dataset.category);
        });
    });

    // Load initial products
    loadProducts("Fruits");

    // Close modal when clicking the close button
    if (listModal) {
        modalClose.addEventListener('click', function() {
            listModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == listModal) {
            listModal.style.display = 'none';
        }
    });

    // Prevent modal from closing when clicking inside it
    listModal.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    const addProductsBtn = document.getElementById('addProductsBtn');
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    const addProductCloseBtn = addProductModal ? addProductModal.querySelector('.close') : null;

    if (addProductsBtn) {
        addProductsBtn.addEventListener('click', function() {
            addProductModal.style.display = 'block';
        });
    }

    if (addProductCloseBtn) {
        addProductCloseBtn.addEventListener('click', function() {
            addProductModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            fetch('../../backend/add_product.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessMessage('Product added successfully!');
                    addProductModal.style.display = 'none';
                    addProductForm.reset();
                    // Optionally, refresh the product list here
                } else {
                    showErrorMessage('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage('An error occurred while adding the product.');
            });
        });
    }

    // Update file input display
    const productImageInput = document.getElementById('productImage');
    const productImageFileName = addProductModal ? addProductModal.querySelector('.file-name') : null;

    if (productImageInput && productImageFileName) {
        productImageInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                productImageFileName.textContent = this.files[0].name;
            } else {
                productImageFileName.textContent = 'No file chosen';
            }
        });
    }

    // Update the HTML to include the "Selected Products" text
    document.querySelector('.selected-products').innerHTML = `
        <h3>Selected Products</h3>
        <ul id="selectedProductsList"></ul>
    `;

    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value;

            fetch('../../backend/update_username.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newUsername: newUsername })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessMessage('Username updated successfully!');
                    document.getElementById('usernameDisplay').textContent = newUsername;
                    settingsModal.style.display = 'none';
                } else {
                    showErrorMessage('Error updating username: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage('An unexpected error occurred. Please try again.');
            });
        });
    }
});

// Add this function at the beginning of your script
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
}

// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('newAvatar');
    const fileName = document.querySelector('.file-name');

    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    }
});

// Add these variables at the top of your file
let currentListId;
let tempListData = {};

// Add this function to handle viewing a list
function viewList(listId) {
    currentListId = listId;
    console.log('Current List ID:', currentListId);
    fetch(`../../backend/get_list_details.php?listId=${listId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const list = data.list;
                document.getElementById('listName').value = list.ListName;
                
                // Format the date to yyyy-MM-dd
                const dueDate = new Date(list.DueDate);
                const formattedDate = dueDate.toISOString().split('T')[0];
                document.getElementById('listDueDate').value = formattedDate;
                
                document.getElementById('listPriority').value = list.Priority.toLowerCase();
                
                // Show the modal
                document.getElementById('listModal').style.display = 'block';
            } else {
                showErrorMessage('Error fetching list details: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An unexpected error occurred. Please try again.');
        });
}

// Close the modal when the close button is clicked
if (modalClose) {
    modalClose.onclick = function() {
        listModal.style.display = 'none';
    }
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == listModal) {
        listModal.style.display = 'none';
    }
}

// Make sure to add event listeners for list items
document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            viewList(listId);
        });
    });
});
// Add these functions at the beginning of your script
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const popup = document.getElementById('messagePopup');
    const messageElement = document.getElementById('popupMessage');
    
    if (!popup || !messageElement) {
        console.error('Popup elements not found');
        return;
    }

    messageElement.textContent = message;
    popup.className = `message-popup ${type}`;
    popup.style.display = 'block';
    popup.style.opacity = '1';
    
    // Ensure the popup is at the top of the stacking order
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); // Short delay for fade-out effect
    }, 3000); // 3 seconds delay
}

// Modify the Save List button event listener
document.getElementById('saveListBtn').addEventListener('click', function() {
    const listName = document.getElementById('listName').value;
    const listDueDate = document.getElementById('listDueDate').value;
    const listPriority = document.getElementById('listPriority').value;

    if (!listName || !listDueDate || !listPriority || !currentListId) {
        showErrorMessage('Please fill in all fields');
        return;
    }

    const updatedList = {
        id: currentListId,
        name: listName,
        dueDate: listDueDate,
        priority: listPriority
    };

    fetch('../../backend/update_list.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedList)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage('List updated successfully!');
            document.getElementById('listModal').style.display = 'none';
            setTimeout(() => {
                location.reload(); // Refresh the page to show updated list
            }, 3000); // Wait for 3 seconds before reloading
        } else {
            showErrorMessage('Error updating list: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('An unexpected error occurred. Please try again.');
    });
});