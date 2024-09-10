document.addEventListener('DOMContentLoaded', function() {
    const backArrow = document.querySelector('.back-arrow'); // Select back arrow element
    const addListForm = document.getElementById('addListForm'); // Select the add list form
    const clearButton = document.querySelector('.btn-secondary'); // Select clear button
    const priorityRadios = document.querySelectorAll('input[name="priority"]'); // Select priority radio buttons
    const successPopup = document.getElementById('successPopup'); // Select success popup element
    
    // Navigate back to the dashboard when back arrow is clicked
    backArrow.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        window.location.href = 'dashboard.php'; // Redirect to dashboard
    });

    // Function to clear the form inputs
    function clearForm() {
        document.getElementById('list-name').value = ''; // Clear list name input
        document.getElementById('due-date').value = ''; // Clear due date input
        priorityRadios.forEach(radio => {
            radio.checked = false; // Uncheck all priority radios
            radio.parentElement.classList.remove('active'); // Remove active class for styling
        });
        document.querySelector('input[name="default"]').checked = false; // Uncheck default checkbox
    }

    // Clear the form when the clear button is clicked
    clearButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default button behavior
        clearForm(); // Call clearForm function
    });

    // Add event listeners for priority radio buttons to show active state
    priorityRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            priorityRadios.forEach(r => r.parentElement.classList.remove('active')); // Reset active state
            if (this.checked) {
                this.parentElement.classList.add('active'); // Set the active class for checked radio
            }
        });
    });

    // Handle form submission
    addListForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        
        // Send form data to the server via fetch
        fetch(addListForm.action, {
            method: 'POST',
            body: new FormData(addListForm) // Prepare form data to be sent
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            if (data.success) {
                showSuccessMessage(data.message); // Show success message
                clearForm(); // Clear the form after successful submission
            } else {
                console.error(data.error); // Log error to console
                alert('Error: ' + data.error); // Show error message to user
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log any unexpected errors
            alert('An unexpected error occurred. Please try again.'); // Show generic error message
        });
    });

    // Function to display success message
    function showSuccessMessage(message) {
        const successMessageElement = document.getElementById('successMessage'); // Select success message element
        successMessageElement.textContent = message; // Set the message text
        successPopup.style.display = 'block'; // Show the success popup
        
        // Set a timeout to hide the popup and redirect to dashboard after 3 seconds
        setTimeout(() => {
            successPopup.style.opacity = '0'; // Start fade-out effect
            setTimeout(() => {
                successPopup.style.display = 'none'; // Hide popup after fade-out
                successPopup.style.opacity = '1'; // Reset opacity for next use
                window.location.href = 'dashboard.php'; // Redirect to dashboard
            }, 300); // Short delay for fade-out effect
        }, 3000); // 3 seconds delay
    }
});