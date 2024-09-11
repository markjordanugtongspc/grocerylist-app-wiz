document.addEventListener('DOMContentLoaded', function() {
    // Select DOM elements
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
    const sortDropdown = document.getElementById('sortDropdown');

    // Add event listeners for sort dropdown
    if (sortDropdown) {
        sortDropdown.addEventListener('change', sortProducts);
    }

    // Close the list modal when clicking the close button or outside the modal
    if (modalClose) {
        modalClose.onclick = function() {
            listModal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target === listModal) {
            listModal.style.display = 'none';
        }
    }

    // Toggle sidebar visibility
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Close sidebar if clicked outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Open settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    // Close settings modal
    settingsCloseBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Load products based on selected category
    function loadProducts(category) {
        productList.innerHTML = ''; // Clear existing products

        // Define existing products by category
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

        // Display existing products in the selected category
        if (existingProducts[category]) {
            existingProducts[category].forEach(product => {
                displayProduct(product, true); // Mark as existing
            });
        }

        // Fetch newly added products from the server
        fetch(`../../backend/get_products.php?category=${category}`)
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    // Check if product is not already displayed
                    if (!existingProducts[category] || !existingProducts[category].some(p => p.ProductName === product.ProductName)) {
                        displayProduct(product, false); // Mark as new
                    }
                });
                // Store all products for sorting
                window.allProducts = [...Object.values(existingProducts).flat(), ...products];
            })
            .catch(error => console.error('Error:', error));
    }

    // Display a single product item
    function displayProduct(product, isExisting) {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.setAttribute('data-category', product.Category || (isExisting ? product.ProductName.split(' ')[0] : 'Other'));
        productItem.innerHTML = `
            <img src="${product.ImageURL || '../../images/products/default.jpg'}" alt="${product.ProductName}">
            <p class="product-name">${product.ProductName}</p>
            <p class="product-price">₱${product.Price ? parseFloat(product.Price).toFixed(2) : 'N/A'}</p>
            ${product.Brand ? `<p class="product-brand">Brand: ${product.Brand}</p>` : ''}
            ${product.WeightVolume ? `<p class="product-weight-volume">Weight/Volume: ${product.WeightVolume}</p>` : ''}
            ${product.Store ? `<p class="product-store">Store: ${product.Store}</p>` : ''}
            <button class="add-to-list-btn">Add</button>
        `;

        // Add product to selected products list
        productItem.querySelector('.add-to-list-btn').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToSelectedProducts({ ...product, isExisting: isExisting });
        });

        productList.appendChild(productItem); // Add product item to the product list
    }

    // Add new sortProducts function
    function sortProducts() {
        const sortValue = sortDropdown.value;

        let sortedProducts = [...window.allProducts];

        // Apply sort
        switch (sortValue) {
            case 'priceLowHigh':
                sortedProducts.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
                break;
            case 'priceHighLow':
                sortedProducts.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
                break;
            case 'nameAZ':
                sortedProducts.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
                break;
            case 'nameZA':
                sortedProducts.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
                break;
        }

        // Clear and repopulate the product list
        productList.innerHTML = '';
        sortedProducts.forEach(product => {
            displayProduct(product, product.isExisting);
        });
    }

    // Add a product to the selected products list
    function addToSelectedProducts(product) {
        const selectedProductsList = document.getElementById('selectedProductsList');
        const existingProduct = selectedProductsList.querySelector(`[data-product-name="${product.ProductName}"]`);

        if (existingProduct) {
            return; // Product already exists, do nothing
        } else {
            // Create a new list item for the product
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

                // Update quantity input and save to local storage on change
                listItem.querySelector('.product-quantity-input').addEventListener('change', (e) => {
                    if (e.target.value < 1) e.target.value = 1; // Minimum quantity
                    if (e.target.value > 999) e.target.value = 999; // Maximum quantity
                    saveListToLocalStorage(); // Save changes
                });
            }

            // Remove product from selected list
            listItem.querySelector('.remove-product').addEventListener('click', () => {
                listItem.remove(); // Remove item from list
                saveListToLocalStorage(); // Save changes
            });

            selectedProductsList.appendChild(listItem); // Add item to selected products list
        }

        // Save to local storage after adding a product
        saveListToLocalStorage();
    }

    // Save the current list to local storage
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
            return; // Exit if required fields are missing
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

        // Update the database with the new list
        updateListInDatabase(listData);
    }

    // Update the list in the database
    function updateListInDatabase(listData) {
        console.log('Updating list with data:', listData);
        // Check for missing fields
        if (!listData.id || !listData.name || !listData.dueDate || !listData.priority || !listData.products) {
            console.error('Missing required fields in listData');
            return; // Exit if required fields are missing
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

    // Handle the save list action
    function saveList(e) {
		e.preventDefault(); // Prevent form submission
	
		const listName = document.getElementById('listName').value;
		const listDueDate = document.getElementById('listDueDate').value;
		const listPriority = document.getElementById('listPriority').value;
	
		const selectedProducts = Array.from(document.querySelectorAll('#selectedProductsList li')).map(item => {
			const [name, price, category] = item.querySelector('.product-name').textContent.split(' - ');
			return {
				name: name,
				price: price.substring(1), // Remove the ₱ symbol
				category: category || '',
				quantity: item.querySelector('.product-quantity-input') ? item.querySelector('.product-quantity-input').value : 1
			};
		});
	
		// Validate required fields
		if (!listName || !listDueDate || !listPriority || !currentListId || selectedProducts.length === 0) {
			showErrorMessage('Please fill in all fields and add at least one product');
			return; // Exit if fields are incomplete
		}
	
		const updatedList = {
			id: currentListId,
			name: listName,
			dueDate: listDueDate,
			priority: listPriority,
			products: selectedProducts // Ensure this is correctly formed
		};
	
		console.log(updatedList); // Log the updated list to debug
	
		// Send updated list to the server
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
					document.getElementById('listModal').style.display = 'none'; // Close modal
					setTimeout(() => {
						location.reload(); // Refresh the page to show updated list
					}, 3000); // Wait for 3 seconds before reloading
				} else {
					showErrorMessage('Error updating list: ' + data.message); // Update to use message from response
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

    // Auto-save list details when changed
    document.getElementById('listName').addEventListener('change', saveListToLocalStorage);
    document.getElementById('listDueDate').addEventListener('change', saveListToLocalStorage);
    document.getElementById('listPriority').addEventListener('change', saveListToLocalStorage);

    // Load products based on category button click
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active')); // Reset active state
            btn.classList.add('active'); // Set current button as active
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
        if (event.target === listModal) {
            listModal.style.display = 'none';
        }
    });

    // Prevent modal from closing when clicking inside it
    listModal.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Handle adding new products
    const addProductsBtn = document.getElementById('addProductsBtn');
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    const addProductCloseBtn = addProductModal ? addProductModal.querySelector('.close') : null;

    if (addProductsBtn) {
        addProductsBtn.addEventListener('click', function() {
            addProductModal.style.display = 'block'; // Open modal
        });
    }

    if (addProductCloseBtn) {
        addProductCloseBtn.addEventListener('click', function() {
            addProductModal.style.display = 'none'; // Close modal
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none'; // Close modal
        }
    });

    // Submit new product form
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            const formData = new FormData(this); // Gather form data

            // Send new product data to the server
            fetch('../../backend/add_product.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showSuccessMessage('Product added successfully!'); // Show success message
                        addProductModal.style.display = 'none'; // Close modal
                        addProductForm.reset(); // Reset form
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

        // Update file input display for product image
		const productImageInput = document.getElementById('productImage');
		const productImageFileName = addProductModal ? addProductModal.querySelector('.file-name') : null;
	
		if (productImageInput && productImageFileName) {
			productImageInput.addEventListener('change', function() {
				if (this.files && this.files.length > 0) {
					productImageFileName.textContent = this.files[0].name; // Display selected file name
				} else {
					productImageFileName.textContent = 'No file chosen'; // Default message
				}
			});
		}
	
		// Initialize selected products section
		document.querySelector('.selected-products').innerHTML = `
			<h3>Selected Products</h3>
			<ul id="selectedProductsList"></ul>
		`;
	
		// Handle username update in settings
		if (settingsForm) {
			settingsForm.addEventListener('submit', function(e) {
				e.preventDefault();
				const newUsername = document.getElementById('newUsername').value;
	
				fetch('../../backend/update_username.php', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							newUsername: newUsername
						})
					})
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							showSuccessMessage('Username updated successfully!');
							document.getElementById('usernameDisplay').textContent = newUsername; // Update display
							settingsModal.style.display = 'none'; // Close modal
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
	
	// Function to generate a random color (not used in the provided code)
	function getRandomColor() {
		const hue = Math.floor(Math.random() * 360);
		return `hsl(${hue}, 70%, 80%)`;
	}
	
	// Additional event listeners for avatar file input
	document.addEventListener('DOMContentLoaded', function() {
		const fileInput = document.getElementById('newAvatar');
		const fileName = document.querySelector('.file-name');
	
		if (fileInput && fileName) {
			fileInput.addEventListener('change', function() {
				if (this.files && this.files.length > 0) {
					fileName.textContent = this.files[0].name; // Show selected file name
				} else {
					fileName.textContent = 'No file chosen'; // Default message
				}
			});
		}
	});
	
	// Global variables to track the current list
	let currentListId;
	let tempListData = {};
	
	// Function to view a specific list's details
	function viewList(listId) {
		currentListId = listId; // Set the current list ID
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
	
					// Show the modal with the list details
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
		if (event.target === listModal) {
			listModal.style.display = 'none';
		}
	}
	
	// Add event listeners for list items to view their details
	document.addEventListener('DOMContentLoaded', function() {
		const listItems = document.querySelectorAll('.list-item');
		listItems.forEach(item => {
			item.addEventListener('click', function() {
				const listId = this.getAttribute('data-id');
				viewList(listId); // Call function to view the selected list
			});
		});
	});
	
	// Functions to show success and error messages
	function showSuccessMessage(message) {
		showMessage(message, 'success');
	}
	
	function showErrorMessage(message) {
		showMessage(message, 'error');
	}
	
	// Display a message popup
	function showMessage(message, type) {
		const popup = document.getElementById('messagePopup');
		const messageElement = document.getElementById('popupMessage');
	
		if (!popup || !messageElement) {
			console.error('Popup elements not found');
			return;
		}
	
		messageElement.textContent = message; // Set the message text
		popup.className = `message-popup ${type}`; // Assign class based on message type
		popup.style.display = 'block'; // Show the popup
		popup.style.opacity = '1';
	
		// Ensure the popup is at the top of the stacking order
		document.body.appendChild(popup);
	
		setTimeout(() => {
			popup.style.opacity = '0'; // Fade out effect
			setTimeout(() => {
				popup.style.display = 'none'; // Hide after fade out
			}, 300); // Short delay for fade-out effect
		}, 3000); // Show for 3 seconds
	}
	
	// Modify the Save List button event listener
	document.getElementById('saveListBtn').addEventListener('click', function() {
		const listName = document.getElementById('listName').value;
		const listDueDate = document.getElementById('listDueDate').value;
		const listPriority = document.getElementById('listPriority').value;
	
		// Validate required fields before saving
		if (!listName || !listDueDate || !listPriority || !currentListId) {
			showErrorMessage('Please fill in all fields');
			return; // Exit if fields are incomplete
		}
	
		const updatedList = {
			id: currentListId,
			name: listName,
			dueDate: listDueDate,
			priority: listPriority
		};
	
		// Send updated list data to the server
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
					showSuccessMessage('List updated successfully!'); // Show success message
					document.getElementById('listModal').style.display = 'none'; // Close modal
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