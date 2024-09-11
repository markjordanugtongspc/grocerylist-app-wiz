document.addEventListener('DOMContentLoaded', function() {
    let currentListId; // Declare this at the top of your script

    // Define predefined prices for existing products
    const predefinedPrices = {
        // Fruits
        'Apple': 4.00,
        'Banana': 7.00,
        'Strawberry': 4.00,
        'Watermelon': 4.00,
        // Vegetables
        'Carrot': 30.00,
        'Broccoli': 40.00,
        // Other
        'Canned Beans': 50.00,
        'Pasta': 45.00
    };

    function closeShoppingListModal() {
        document.getElementById('shoppingListModal').style.display = 'none';
    }

    // Function to open the shopping list modal with list details
    function viewShoppingList(listId) {
        currentListId = listId; // Set the currentListId when viewing a list
        fetch(`../../backend/get_list_details.php?listId=${listId}`)
            .then(response => response.json())
            .then(list => {
                if (list.success) {
                    const listName = list.list.ListName || 'Grocery List';

                    document.getElementById('shoppingListTitle').textContent = listName;

                    // Fetch the products for this shopping list
                    fetch(`../../backend/get_selected_products.php?listId=${listId}`)
                        .then(response => response.json())
                        .then(data => {
                            const productTableBody = document.getElementById('shoppingProductTableBody');
                            productTableBody.innerHTML = '';
                            let total = 0;
                            let allPurchased = true;

                            data.products.forEach(product => {
                                const row = document.createElement('tr');
                                if (product.IsPurchased == 1) {
                                    row.classList.add('purchased');
                                } else {
                                    allPurchased = false;
                                }
                                // Use predefined price if available, otherwise use the price from the database
                                const price = predefinedPrices[product.ProductName] || parseFloat(product.Price) || 0;
                                const quantity = parseInt(product.Quantity) || 0;
                                const subtotal = price * quantity;
                                total += subtotal;

                                row.innerHTML = `
                                    <td>${product.ProductName}</td>
                                    <td>${product.Brand || ''}</td>
                                    <td>${product.WeightVolume || ''}</td>
                                    <td>${product.Store || ''}</td>
                                    <td>${quantity}</td>
                                `;
                                productTableBody.appendChild(row);
                            });

                            // Format the total price
                            const formattedTotal = formatPrice(total);
                            const totalElement = document.getElementById('shoppingListTotal');
                            totalElement.textContent = formattedTotal;

                            // Apply strikethrough if all items are purchased
                            if (allPurchased) {
                                totalElement.style.textDecoration = 'line-through';
                            } else {
                                totalElement.style.textDecoration = 'none';
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching products:', error);
                            showErrorMessage('Failed to load product details.');
                        });

                    document.getElementById('shoppingListModal').style.display = 'flex'; // Show modal
                } else {
                    showErrorMessage('Failed to load list details.');
                }
            })
            .catch(error => {
                console.error('Error fetching list details:', error);
                showErrorMessage('An unexpected error occurred. Please try again.');
            });
    }

    // Function to format the price
    function formatPrice(price) {
        const roundedPrice = Math.round(price * 100) / 100; // Round to 2 decimal places
        const [integerPart, decimalPart] = roundedPrice.toFixed(2).split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        if (parseInt(decimalPart) === 0) {
            return `₱${formattedInteger}`;
        } else {
            return `₱${formattedInteger}.${decimalPart}`;
        }
    }

    // Add this function to calculate and update the total
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

    // Attach event listeners to the buttons in the modal
    document.querySelector('.shopping-list-btn-purchase').addEventListener('click', function() {
        if (!currentListId) {
            showErrorMessage('No list selected');
            return;
        }
        const listId = currentListId;
        fetch('../../backend/update_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'markPurchased',
                listId: listId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const productTableBody = document.getElementById('shoppingProductTableBody');
                const rows = productTableBody.getElementsByTagName('tr');
                for (let row of rows) {
                    row.classList.add('purchased');
                }
                // Apply strikethrough to the total
                document.getElementById('shoppingListTotal').style.textDecoration = 'line-through';
                showSuccessMessage('Products Purchased Successfully');
                setTimeout(() => {
                    closeShoppingListModal();
                }, 3000);
            } else {
                showErrorMessage('Error marking products as purchased: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An unexpected error occurred. Please try again.');
        });
    });

    document.querySelector('.shopping-list-btn-edit').addEventListener('click', function() {
        document.getElementById('listModal').style.display = 'block';
        document.getElementById('shoppingListModal').style.display = 'none';
    });

    document.querySelector('.shopping-list-btn-delete').addEventListener('click', function() {
        if (!currentListId) {
            showErrorMessage('No list selected');
            return;
        }
        if (confirm('Are you sure you want to delete this list?')) {
            const listId = currentListId;
            fetch(`../../backend/delete_list.php?listId=${listId}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessMessage('List Deleted Successfully');
                    setTimeout(() => {
                        closeShoppingListModal();
                        location.reload(); // Reload the page to update the list of grocery lists
                    }, 3000);
                } else {
                    showErrorMessage('Error deleting list: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage('An unexpected error occurred. Please try again.');
            });
        }
    });

    // Add event listener for list items to view their details
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            viewShoppingList(listId);
        });
    });

    // Expose functions to the global scope
    window.closeShoppingListModal = closeShoppingListModal;
    window.viewShoppingList = viewShoppingList;
    window.updateShoppingListTotal = updateShoppingListTotal;
    window.formatPrice = formatPrice;
});