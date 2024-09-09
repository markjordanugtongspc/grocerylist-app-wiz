document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.querySelector('.close');
    const settingsForm = document.getElementById('settingsForm');
    const listModal = document.getElementById('listModal');
    const productList = document.getElementById('productList');
    const selectedProducts = document.getElementById('selectedProducts');
    const saveListBtn = document.getElementById('saveListBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    let currentListId;
    let tempListData = {};

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
        
        // Existing products
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
                displayProduct(product);
            });
        }

        // Fetch and display newly added products
        fetch(`../../backend/get_products.php?category=${category}`)
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    if (!existingProducts[category] || !existingProducts[category].some(p => p.ProductName === product.ProductName)) {
                        displayProduct(product);
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function displayProduct(product) {
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

        productItem.querySelector('.add-to-list-btn').addEventListener('click', () => {
            addToSelectedProducts(product);
        });

        productList.appendChild(productItem);
    }

    function addToSelectedProducts(product) {
        const selectedProductsList = document.getElementById('selectedProducts');
        const existingProduct = selectedProductsList.querySelector(`[data-product-name="${product.ProductName}"]`);
    
        if (existingProduct) {
            // If the product already exists, don't do anything
            return;
        } else {
            // Add new product to the list
            const listItem = document.createElement('li');
            listItem.setAttribute('data-product-name', product.ProductName);
            
            // Check if it's a pre-existing product or a newly added one
            if (product.Category === undefined) {
                // Pre-existing product
                listItem.innerHTML = `
                    <span class="product-name">${product.ProductName} - ₱${parseFloat(product.Price).toFixed(2)}</span>
                    <span class="product-quantity">1x</span>
                    <button class="remove-product" title="Remove">×</button>
                `;
            } else {
                // Newly added product
                listItem.innerHTML = `
                    <span class="product-name">${product.ProductName} - ₱${parseFloat(product.Price).toFixed(2)} - ${product.Category}</span>
                    <input type="number" class="product-quantity" value="1" min="1">
                    <button class="remove-product" title="Remove">×</button>
                `;
    
                listItem.querySelector('.product-quantity').addEventListener('change', (e) => {
                    if (e.target.value < 1) e.target.value = 1;
                });
            }
    
            listItem.querySelector('.remove-product').addEventListener('click', () => {
                listItem.remove();
            });
    
            selectedProductsList.appendChild(listItem);
        }
    }

    // Add this function to handle saving the list
    function saveList() {
        const listName = document.getElementById('listName').value;
        const listDueDate = document.getElementById('listDueDate').value;
        const listPriority = document.getElementById('listPriority').value;
        
        const selectedProductsData = Array.from(selectedProducts.querySelectorAll('.selected-product')).map(item => ({
            name: item.querySelector('.product-name').textContent,
            category: item.querySelector('.product-category').textContent,
            price: parseFloat(item.querySelector('.product-price').textContent.replace('₱', '')),
            quantity: parseInt(item.querySelector('.quantity-input').value)
        }));

        tempListData = {
            id: currentListId,
            name: listName,
            dueDate: listDueDate,
            priority: listPriority,
            products: selectedProductsData
        };

        // Store the tempListData in localStorage
        localStorage.setItem('tempListData', JSON.stringify(tempListData));

        // Close the modal
        listModal.style.display = 'none';

        // Show a success message
        alert('List saved successfully!');
    }

    // Add event listener for the Save List button
    document.getElementById('saveListBtn').addEventListener('click', saveList);

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
    const closeBtn = listModal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        listModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == listModal) {
            listModal.style.display = 'none';
        }
    });

    const addProductsBtn = document.getElementById('addProductsBtn');
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    const addProductCloseBtn = addProductModal.querySelector('.close');

    addProductsBtn.addEventListener('click', function() {
        addProductModal.style.display = 'block';
    });

    addProductCloseBtn.addEventListener('click', function() {
        addProductModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

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
                alert('Product added successfully!');
                addProductModal.style.display = 'none';
                addProductForm.reset();
                // Optionally, refresh the product list here
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the product.');
        });
    });

    // Update file input display
    const productImageInput = document.getElementById('productImage');
    const productImageFileName = addProductModal.querySelector('.file-name');

    productImageInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            productImageFileName.textContent = this.files[0].name;
        } else {
            productImageFileName.textContent = 'No file chosen';
        }
    });

    // Update the HTML to include the "Selected Products" text
    document.querySelector('.selected-products').innerHTML = `
        <h3>Selected Products</h3>
        <ul id="selectedProducts"></ul>
    `;
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

    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
});

// Add these variables at the top of your file
const listModal = document.getElementById('listModal');
const modalClose = listModal.querySelector('.close');

// Add this function to handle viewing a list
function viewList(listId) {
    currentListId = listId;
    
    // Fetch the list details from the server
    fetch(`../../backend/get_list_details.php?listId=${listId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const listModal = document.getElementById('listModal');
                const listName = document.getElementById('listName');
                const listDueDate = document.getElementById('listDueDate');
                const listPriority = document.getElementById('listPriority');
                const selectedProducts = document.getElementById('selectedProducts');

                if (listModal && listName && listDueDate && listPriority && selectedProducts) {
                    // Populate the modal with list details
                    listName.value = data.list.ListName;
                    listDueDate.value = data.list.DueDate;
                    listPriority.value = data.list.Priority;
                    
                    // Clear existing products
                    selectedProducts.innerHTML = '';
                    
                    // Add products to the selected products list
                    data.list.products.forEach(product => addToSelectedProducts(product));
                    
                    // Show the modal
                    listModal.style.display = 'block';
                } else {
                    console.error('One or more required elements are missing from the DOM');
                    alert('Error: Unable to display list details. Please try again later.');
                }
            } else {
                console.error('Error fetching list details:', data.error);
                alert('Error fetching list details: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('An unexpected error occurred. Please check the console for more details.');
        });
}

// Close the modal when the close button is clicked
modalClose.onclick = function() {
    listModal.style.display = 'none';
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
