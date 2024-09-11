document.addEventListener('DOMContentLoaded', function() {
    let currentListId; // Declare this at the top of your script

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
                    const listName = list.ListName || 'Grocery List';

                    document.getElementById('shoppingListTitle').textContent = listName;

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

                    document.getElementById('shoppingListModal').style.display = 'flex'; // Show modal
                }
            })
            .catch(error => {
                console.error('Error fetching list details:', error);
            });
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
});