document.addEventListener('DOMContentLoaded', function() {
    function closeShoppingListModal() {
        document.getElementById('shoppingListModal').style.display = 'none';
    }

    // Function to open the shopping list modal with list details
    function viewShoppingList(listId) {
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
                                row.innerHTML = `
                                    <td>${product.ProductName}</td>
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
        alert('Purchase action initiated');
        // Implement purchase logic here
    });

    document.querySelector('.shopping-list-btn-edit').addEventListener('click', function() {
        document.getElementById('listModal').style.display = 'block';
        document.getElementById('shoppingListModal').style.display = 'none';
    });

    document.querySelector('.shopping-list-btn-delete').addEventListener('click', function() {
        alert('Delete action initiated');
        // Implement delete logic here
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