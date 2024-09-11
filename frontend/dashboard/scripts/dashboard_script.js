document.addEventListener('DOMContentLoaded', function() {
    // Select DOM elements
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.querySelector('.close');
    const listModal = document.getElementById('listModal');
    const modalClose = listModal ? listModal.querySelector('.close') : null;
    const productList = document.getElementById('productList');
    const selectedProducts = document.getElementById('selectedProducts');
    const saveListBtn = document.getElementById('saveListBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const sortDropdown = document.getElementById('sortDropdown');
    const addProductsBtn = document.getElementById('addProductsBtn');
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    const addProductCloseBtn = addProductModal ? addProductModal.querySelector('.close') : null;
    const updatedListModal = document.getElementById('updatedListModal');
    const closeUpdatedListModal = document.getElementById('closeUpdatedListModal');
    const shoppingListModal = document.getElementById('shoppingListModal');
    const settingsForm = document.getElementById('settingsForm'); // Assuming there's a settings form
    const editProductImage = document.getElementById('editProductImage');
    const editProductImageName = document.querySelector('#editProductModal .file-name');

    let currentListId; // Track the current list ID

    function updateShoppingListTotal() {
        let total = 0;
        const rows = document.querySelectorAll('#shoppingProductTableBody tr');
        rows.forEach(row => {
            const priceCell = row.querySelector('td[data-price]');
            const quantityCell = row.querySelector('td:last-child');
            if (priceCell && quantityCell) {
                const price = parseFloat(priceCell.dataset.price);
                const quantity = parseInt(quantityCell.textContent);
                total += price * quantity;
            }
        });
        document.getElementById('shoppingListTotal').textContent = `₱${total.toFixed(2)}`;
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

    // Open and close settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    settingsCloseBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Add event listeners for sort dropdown
    if (sortDropdown) {
        sortDropdown.addEventListener('change', sortProducts);
    }

    // Handle modal close
    if (modalClose) {
        modalClose.onclick = function() {
            listModal.style.display = 'none';
        };
    }

    window.onclick = function(event) {
        if (event.target === listModal || event.target === addProductModal || event.target === updatedListModal) {
            event.target.style.display = 'none';
        }
    };

    // Load products based on selected category
    function loadProducts(category) {
        productList.innerHTML = ''; // Clear existing products

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

        if (existingProducts[category]) {
            existingProducts[category].forEach(product => {
                displayProduct(product, true);
            });
        }

        fetch(`../../backend/get_products.php?category=${category}`)
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    if (!existingProducts[category] || !existingProducts[category].some(p => p.ProductName === product.ProductName)) {
                        displayProduct(product, false);
                    }
                });
                window.allProducts = [...Object.values(existingProducts).flat(), ...products];
            })
            .catch(error => console.error('Error:', error));
    }

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

        productItem.querySelector('.add-to-list-btn').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToSelectedProducts({ ...product, isExisting: isExisting });
        });

        productList.appendChild(productItem);
    }

    function sortProducts() {
        const sortValue = sortDropdown.value;
        let sortedProducts = [...window.allProducts];

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

        productList.innerHTML = '';
        sortedProducts.forEach(product => {
            displayProduct(product, product.isExisting);
        });
    }

    function addToSelectedProducts(product) {
        const selectedProductsList = document.getElementById('selectedProductsList');
        const existingProduct = selectedProductsList.querySelector(`[data-product-name="${product.ProductName}"]`);

        if (existingProduct) {
            return;
        } else {
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
                price: price.substring(1),
                category: category || '',
                quantity: item.querySelector('.product-quantity-input') ? item.querySelector('.product-quantity-input').value : 1
            };
        });

        if (!currentListId || !listName || !listDueDate || !listPriority) {
            console.error('Missing required fields');
            return;
        }

        const listData = {
            id: currentListId,
            name: listName,
            dueDate: listDueDate,
            priority: listPriority,
            products: selectedProductsData
        };

        localStorage.setItem(`groceryList_${currentListId}`, JSON.stringify(listData));
        updateListInDatabase(listData);
    }

    function updateListInDatabase(listData) {
        console.log('Updating list with data:', listData);
        if (!listData.id || !listData.name || !listData.dueDate || !listData.priority || !listData.products) {
            console.error('Missing required fields in listData');
            return;
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
        e.preventDefault();

        const listName = document.getElementById('listName').value;
        const listDueDate = document.getElementById('listDueDate').value;
        const listPriority = document.getElementById('listPriority').value;

        const selectedProducts = Array.from(document.querySelectorAll('#selectedProductsList li')).map(item => {
            const [name, price, category] = item.querySelector('.product-name').textContent.split(' - ');
            return {
                name: name,
                price: price.substring(1),
                category: category || '',
                quantity: item.querySelector('.product-quantity-input') ? item.querySelector('.product-quantity-input').value : 1
            };
        });

        if (!listName || !listDueDate || !listPriority || !currentListId || selectedProducts.length === 0) {
            showErrorMessage('Please fill in all fields and add at least one product');
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
                listModal.style.display = 'none';
                setTimeout(() => {
                    location.reload();
                }, 3000);
            } else {
                showErrorMessage('Error updating list: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An unexpected error occurred. Please try again.');
        });
    }

    if (saveListBtn) {
        saveListBtn.addEventListener('click', saveList);
    }

    document.getElementById('listName').addEventListener('change', saveListToLocalStorage);
    document.getElementById('listDueDate').addEventListener('change', saveListToLocalStorage);
    document.getElementById('listPriority').addEventListener('change', saveListToLocalStorage);

    // Handle category button click to load products
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProducts(btn.dataset.category === 'Processed Foods' ? 'Other' : btn.dataset.category);
        });
    });

    loadProducts("Fruits");

    // Handle adding new products
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
                body: JSON.stringify({
                    newUsername: newUsername
                })
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

    function showSuccessMessage(message) {
        const popup = document.getElementById('messagePopup');
        popup.textContent = message;
        popup.className = 'message-popup success';
        popup.style.display = 'block';
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.style.display = 'none';
                popup.classList.remove('fade-out');
            }, 500);
        }, 2500);
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

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }, 3000);
    }

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

    // Restore functionality to view and edit a grocery list
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            viewShoppingList(listId);
        });
    });

    function viewShoppingList(listId) {
		currentListId = listId;
		fetch(`../../backend/get_list_details.php?listId=${listId}`)
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					const list = data.list;
					document.getElementById('shoppingListTitle').textContent = list.ListName;
	
					// Fetch the products for this shopping list
					fetch(`../../backend/get_selected_products.php?listId=${listId}`)
						.then(response => response.json())
						.then(data => {
							const productTableBody = document.getElementById('shoppingProductTableBody');
							productTableBody.innerHTML = '';
	
							data.products.forEach(product => {
								const row = document.createElement('tr');
								if (product.IsPurchased == 1) {
									row.classList.add('purchased');
								}
								row.innerHTML = `
									<td>${product.ProductName}</td>
									<td>${product.Brand}</td>
									<td>${product.WeightVolume}</td>
									<td>${product.Store}</td>
									<td>${product.Quantity}</td>
								`;
								productTableBody.appendChild(row);
							});
						})
						.catch(error => {
							console.error('Error fetching products:', error);
						});
	
					shoppingListModal.style.display = 'block';
				} else {
					showErrorMessage('Error fetching list details: ' + data.error);
				}
			})
			.catch(error => {
				console.error('Error:', error);
				showErrorMessage('An unexpected error occurred. Please try again.');
			});
	}
	
	// Attach event listeners to the buttons in the shopping list modal
	document.querySelector('.shopping-list-btn-edit').addEventListener('click', function() {
		fetch(`../../backend/get_list_details.php?listId=${currentListId}`)
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					const list = data.list;
					document.getElementById('listName').value = list.ListName;
					const dueDate = new Date(list.DueDate);
					const formattedDate = dueDate.toISOString().split('T')[0];
					document.getElementById('listDueDate').value = formattedDate;
					document.getElementById('listPriority').value = list.Priority.toLowerCase();
					listModal.style.display = 'block';
					shoppingListModal.style.display = 'none';
				} else {
					showErrorMessage('Error fetching list details: ' + data.error);
				}
			})
			.catch(error => {
				console.error('Error:', error);
				showErrorMessage('An unexpected error occurred. Please try again.');
			});
	});
	
	// Make these functions globally accessible
	window.showSuccessMessage = showSuccessMessage;
	window.showErrorMessage = showErrorMessage;
	
	const editProductsBtn = document.getElementById('editProductsBtn');
	const editProductModal = document.getElementById('editProductModal');
	const editProductForm = document.getElementById('editProductForm');
	const editProductCloseBtn = editProductModal.querySelector('.close');
	const selectProductToEdit = document.getElementById('selectProductToEdit');
	
	function populateEditForm(product) {
		document.getElementById('editProductName').value = product.ProductName;
		document.getElementById('editBrand').value = product.Brand;
		document.getElementById('editPrice').value = product.Price;
		document.getElementById('editWeightVolume').value = product.WeightVolume;
		document.getElementById('editQuantity').value = product.Quantity;
		document.getElementById('editStore').value = product.Store;
		document.getElementById('editCategory').value = product.Category;
	}
	
	editProductForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const formData = new FormData(this);
		formData.append('oldProductName', selectProductToEdit.value);
		const category = document.getElementById('editCategory').value.toLowerCase();
	
		// Append category to formData for server processing
		formData.append('categoryPath', `../../images/products/${category}/`);
	
		// Handle image change
		const updatedProductImage = document.getElementById('editProductImage').files[0];
		if (updatedProductImage) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const imageBase64 = reader.result;
				formData.append('updatedProductImage', imageBase64);
	
				// Proceed with existing fetch call after reading the image
				updateProduct(formData);
			};
			reader.readAsDataURL(updatedProductImage);
		} else {
			// If no image is provided, proceed without image data
			updateProduct(formData);
		}
	});
	
	function updateProduct(formData) {
		fetch('../../backend/update_product.php', {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				showSuccessMessage('Product updated successfully');
				editProductModal.style.display = 'none';
				// Refresh the product list or update the UI as needed
				loadProducts(document.getElementById('currentCategory').value || 'Fruits'); // Assuming you have a way to get the current category
			} else {
				showErrorMessage('Error updating product: ' + (data.error || 'Unknown error'));
			}
		})
		.catch(error => {
			console.error('Error:', error);
			showErrorMessage('An unexpected error occurred. Please try again.');
		});
	}
	
	// Open edit product modal
	editProductsBtn.addEventListener('click', function() {
		editProductModal.style.display = 'block';
		loadProductNames();
		loadStores();
	});
	
	// Close edit product modal
	editProductCloseBtn.addEventListener('click', function() {
		editProductModal.style.display = 'none';
	});    
	
	// Load product names for dropdown
	function loadProductNames() {
		fetch('../../backend/get_product_names.php')
			.then(response => response.json())
			.then(data => {
				const datalist = document.getElementById('productNameList');
				datalist.innerHTML = '';
				data.forEach(product => {
					const option = document.createElement('option');
					option.value = product.ProductName;
					datalist.appendChild(option);
				});
			})
			.catch(error => console.error('Error:', error));
	}
	
	// Load stores for dropdown
	function loadStores() {
		fetch('../../backend/get_stores.php')
			.then(response => response.json())
			.then(data => {
				const datalist = document.getElementById('storeList');
				datalist.innerHTML = '';
				data.forEach(store => {
					const option = document.createElement('option');
					option.value = store;
					datalist.appendChild(option);
				});
			})
			.catch(error => console.error('Error:', error));
	}
	
	// Load product details when a product is selected
	selectProductToEdit.addEventListener('change', function() {
		const selectedProduct = this.value;
		if (selectedProduct) {
			loadProductDetails(selectedProduct);
		}
	});
	
	// Load product details
	function loadProductDetails(productName) {
		fetch(`../../backend/get_product_details.php?productName=${encodeURIComponent(productName)}`)
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					populateEditForm(data.product);
				}
			})
			.catch(error => console.error('Error:', error));
	}
	
	// Update the file name display when a file is selected
	if (editProductImage && editProductImageName) {
		editProductImage.addEventListener('change', function() {
			if (this.files && this.files.length > 0) {
				editProductImageName.textContent = this.files[0].name;
			} else {
				editProductImageName.textContent = 'No file chosen';
			}
		});
	}
});