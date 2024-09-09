document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeBtn = document.querySelector('.close');
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

    closeBtn.addEventListener('click', function() {
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
            
            listsData[id] = {
                list_name: name,
                due_date: dueDate,
                priority: priority,
                products: [] // We'll assume products are empty for now
            };
        });
    }

    // Call this function when the page loads
    fetchListsData();

    // Modified viewList function
    window.viewList = function(listId) {
        currentListId = listId;
        const listDetails = listsData[listId];
        if (!listDetails) {
            alert('List not found.');
            return;
        }

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
    };

    // Modified loadProducts function
    function loadProducts(category) {
        productList.innerHTML = '';
        categories[category].forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <p>₱${product.price.toFixed(2)}</p>
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
                <span>${product.name} - ₱${product.price.toFixed(2)} <span class="quantity">1</span>x</span>
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

    // Modified saveListBtn event listener
    saveListBtn.addEventListener('click', function() {
        const listData = {
            id: currentListId,
            name: document.getElementById('listName').value,
            dueDate: document.getElementById('listDueDate').value,
            priority: document.getElementById('listPriority').value,
            products: Array.from(selectedProducts.querySelectorAll('.selected-product')).map(p => {
                const [name, price] = p.querySelector('span').textContent.split(' - ');
                const quantity = p.querySelector('.quantity').textContent;
                return { name, price, quantity };
            })
        };

        // Update the listsData object temporarily
        listsData[currentListId] = {
            list_name: listData.name,
            due_date: listData.dueDate,
            priority: listData.priority,
            products: listData.products
        };

        alert('List updated successfully!');
        listModal.style.display = 'none';
        updateListsUI(); // Update the UI to reflect changes
    });

    const closeListModal = listModal.querySelector('.close');

    closeListModal.addEventListener('click', function() {
        listModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == listModal) {
            listModal.style.display = 'none';
        }
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
