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
    let listsData = {}; // This will store the lists data fetched from the backend

    const categories = {
        "Fruits": [
            { name: "Strawberry", price: 4.00, image: "../../images/products/fruits/strawberry.jpg" },
            { name: "Banana", price: 7.00, image: "../../images/products/fruits/banana.jpg" },
            { name: "Apple", price: 4.00, image: "../../images/products/fruits/apple.jpg" },
            { name: "Watermelon", price: 4.00, image: "../../images/products/fruits/watermelon.jpg" }
        ],
        "Vegetables": [
            { name: "Carrot", price: 2.00, image: "../../images/products/vegetables/carrot.jpg" },
            { name: "Broccoli", price: 3.00, image: "../../images/products/vegetables/broccoli.jpg" }
        ],
        "Processed Foods": [
            { name: "Canned Beans", price: 1.50, image: "../../images/products/other/canned-beans.jpg" },
            { name: "Pasta", price: 2.50, image: "../../images/products/other/pasta.jpg" }
        ]
    };

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

    // Function to fetch lists data from the DOM
    function fetchListsData() {
        const listItems = document.querySelectorAll('.list-item');
        listItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const name = item.querySelector('h3').textContent;
            const dueDate = item.querySelector('p').textContent.replace('Due: ', '');
            const priority = item.querySelector('.priority-circle').classList[1];
            const lastModified = item.getAttribute('data-last-modified');
            
            listsData[id] = {
                list_name: name,
                due_date: dueDate,
                priority: priority,
                lastModified: lastModified,
                products: [] // We'll assume products are empty for now
            };
        });
    }

    // Call this function when the page loads
    fetchListsData();

    window.viewList = function(listId) {
        currentListId = listId;
        const listDetails = listsData[listId];
        if (!listDetails) {
            alert('List not found.');
            return;
        }

        if (listDetails.lastModified && listDetails.lastModified !== 'null') {
            // Show the view modal for modified lists
            const viewListModal = document.getElementById('viewListModal');
            const modalContent = viewListModal.querySelector('.modal-content');

            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>${listDetails.list_name}</h2>
                <p><i class="far fa-calendar-alt"></i> Due: ${listDetails.due_date}</p>
                <div class="priority ${listDetails.priority.toLowerCase()}">${listDetails.priority}</div>
                <h3>Shopping List</h3>
                <ul>
                    ${listDetails.products.map(product => `
                        <li>
                            <span class="product-name">${product.name}</span>
                            <span class="product-quantity">${product.quantity}x</span>
                        </li>
                    `).join('')}
                </ul>
                <button id="editProductsBtn"><i class="fas fa-edit"></i> Edit List</button>
                <button id="deleteListBtn"><i class="fas fa-trash-alt"></i> Delete List</button>
            `;

            viewListModal.style.display = 'block';

            modalContent.querySelector('.close').addEventListener('click', function() {
                viewListModal.style.display = 'none';
            });

            document.getElementById('editProductsBtn').addEventListener('click', function() {
                viewListModal.style.display = 'none';
                showListEditModal(listId);
            });

            document.getElementById('deleteListBtn').addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this list?')) {
                    deleteList(listId);
                }
            });
        } else {
            // Show the edit modal directly for unmodified lists
            showListEditModal(listId);
        }
    };

    // Allow closing the modal by clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == viewListModal) {
            viewListModal.style.display = 'none';
        }
    });

    function showListEditModal(listId) {
        const listDetails = listsData[listId];
        if (!listDetails) return;

        document.getElementById('modalTitle').textContent = `Edit List: ${listDetails.list_name}`;
        document.getElementById('listName').value = listDetails.list_name;
        document.getElementById('listDueDate').value = listDetails.due_date;
        document.getElementById('listPriority').value = listDetails.priority;

        selectedProducts.innerHTML = '<h3>Selected Products</h3>';
        if (listDetails.products && listDetails.products.length > 0) {
            listDetails.products.forEach(product => {
                addToSelectedProducts(product);
            });
        }

        listModal.style.display = 'block';
        loadProducts('Fruits'); // Load fruits by default
    }

    // Modified loadProducts function
    function loadProducts(category) {
        productList.innerHTML = '';
        categories[category].forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <p>₱${parseFloat(product.price).toFixed(2)}</p>
                <button class="add-to-list-btn">Add</button>
            `;
            productItem.querySelector('.add-to-list-btn').addEventListener('click', () => addToSelectedProducts(product));
            productList.appendChild(productItem);
        });
    }

    // Modified addToSelectedProducts function
    function addToSelectedProducts(product) {
        const existingProduct = Array.from(selectedProducts.querySelectorAll('.selected-product')).find(item => 
            item.querySelector('span').textContent.includes(product.name)
        );

        if (existingProduct) {
            // If product already exists, update quantity
            const quantitySpan = existingProduct.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent) + 1;
            quantitySpan.textContent = quantity;
        } else {
            // If product doesn't exist, add new item
            const productItem = document.createElement('div');
            productItem.className = 'selected-product';
            productItem.innerHTML = `
                <span>${product.name} - ₱${parseFloat(product.price).toFixed(2)} <span class="quantity">1</span>x</span>
                <button class="remove-btn">Remove</button>
            `;
            productItem.querySelector('.remove-btn').addEventListener('click', () => productItem.remove());
            selectedProducts.appendChild(productItem);
        }
    }

    // Category button event listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProducts(btn.dataset.category);
        });
    });

    function deleteList(listId) {
        // For now, we'll just remove it from the frontend
        delete listsData[listId];
        updateListsUI();
        viewListModal.style.display = 'none';
        // You would typically send a request to the server here to delete the list
    }

    // Modified saveListBtn event listener
    saveListBtn.addEventListener('click', function() {
        const listData = {
            id: currentListId,
            name: document.getElementById('listName').value,
            dueDate: document.getElementById('listDueDate').value,
            priority: document.getElementById('listPriority').value,
            products: Array.from(selectedProducts.querySelectorAll('.selected-product')).map(p => {
                const [name, priceWithCurrency] = p.querySelector('span').textContent.split(' - ');
                const price = parseFloat(priceWithCurrency.replace('₱', '').trim());
                const quantity = parseInt(p.querySelector('.quantity').textContent);
                return { name, price, quantity };
            })
        };

        // Send request to update the list in the backend
        fetch('../../backend/update_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update the listsData object
                listsData[currentListId] = {
                    list_name: listData.name,
                    due_date: listData.dueDate,
                    priority: listData.priority,
                    lastModified: data.lastModified,
                    products: listData.products
                };

                listModal.style.display = 'none';
                updateListsUI();
                viewList(currentListId); // Show the view modal after saving
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        });
    });

    // Function to update the UI after editing a list
    function updateListsUI() {
        const listContainer = document.querySelector('.list-container');
        if (listContainer) {
            listContainer.innerHTML = '';
            for (const [id, list] of Object.entries(listsData)) {
                const listItem = document.createElement('div');
                listItem.className = 'list-item clickable';
                listItem.setAttribute('data-id', id);
                listItem.setAttribute('data-last-modified', list.lastModified || 'null');
                listItem.onclick = () => viewList(id);
                listItem.innerHTML = `
                    <h3>${list.list_name}</h3>
                    <p>Due: ${list.due_date}</p>
                    <p class="priority">
                        <span class="priority-circle ${list.priority.toLowerCase()}"></span>
                        Priority: ${list.priority}
                    </p>
                `;
                listContainer.appendChild(listItem);
            }
        }
    }

    // Load initial lists
    updateListsUI();

    // Load the first category by default
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
        if (event.target == viewListModal) {
            viewListModal.style.display = 'none';
        }
    });
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
