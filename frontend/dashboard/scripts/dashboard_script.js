document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeBtn = document.querySelector('.close');
    const settingsForm = document.getElementById('settingsForm');

    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside of it
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
    closeBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Close settings modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Handle form submission
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(settingsForm);
        
        fetch('../../backend/update_profile.php', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Add this line
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Profile updated successfully!');
                document.getElementById('usernameDisplay').textContent = data.newUsername;
                if (data.newAvatar) {
                    document.getElementById('userAvatar').src = data.newAvatar;
                }
                settingsModal.style.display = 'none';
            } else {
                alert('Error updating profile: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the profile.');
        });
    });

    // Define viewList function in the global scope
    window.viewList = function(listId) {
        currentListId = listId; // Set the current list ID
        // Fetch list details and populate the modal
        fetch(`../../backend/get_list_details.php?id=${listId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('modalTitle').textContent = `Edit List: ${data.list_name}`;
                document.getElementById('listName').value = data.list_name;
                document.getElementById('listDueDate').value = data.due_date;
                document.getElementById('listPriority').value = data.priority;

                // Populate selected products
                selectedProducts.innerHTML = '<h3>Selected Products</h3>';
                data.products.forEach(product => {
                    addToSelectedProducts(product);
                });

                // Show the modal
                listModal.style.display = 'block';
                loadProducts('fresh-fruits'); // Load initial category
            })
            .catch(error => console.error('Error:', error));
    };

    const listModal = document.getElementById('listModal');
    const productList = document.getElementById('productList');
    const selectedProducts = document.getElementById('selectedProducts');
    const saveListBtn = document.getElementById('saveListBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    function loadProducts(category) {
        // Fetch products for the selected category
        fetch(`../../backend/get_products.php?category=${category}`)
            .then(response => response.json())
            .then(data => {
                productList.innerHTML = '';
                data.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <p>${product.name}</p>
                        <p>$${product.price}</p>
                    `;
                    productItem.addEventListener('click', () => addToSelectedProducts(product));
                    productList.appendChild(productItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function addToSelectedProducts(product) {
        const productItem = document.createElement('div');
        productItem.className = 'selected-product';
        productItem.innerHTML = `
            <span>${product.name} - $${product.price}</span>
            <button class="remove-btn">Remove</button>
        `;
        productItem.querySelector('.remove-btn').addEventListener('click', () => productItem.remove());
        selectedProducts.appendChild(productItem);
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProducts(btn.dataset.category);
        });
    });

    saveListBtn.addEventListener('click', function() {
        const listData = {
            id: currentListId, // You need to set this when opening the modal
            name: document.getElementById('listName').value,
            dueDate: document.getElementById('listDueDate').value,
            priority: document.getElementById('listPriority').value,
            products: Array.from(selectedProducts.querySelectorAll('.selected-product')).map(p => p.querySelector('span').textContent.split(' - ')[0])
        };

        fetch('../../backend/update_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('List updated successfully!');
                listModal.style.display = 'none';
                // Refresh the list display
                // You might want to implement a function to reload the lists
            } else {
                alert('Error updating list: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    const closeModal = document.querySelector('.close');

    closeModal.addEventListener('click', function() {
        listModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == listModal) {
            listModal.style.display = 'none';
        }
    });
});