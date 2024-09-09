document.addEventListener('DOMContentLoaded', function() {
    const backArrow = document.querySelector('.back-arrow');
    const addListForm = document.getElementById('addListForm');
    const clearButton = document.querySelector('.btn-secondary');
    const priorityRadios = document.querySelectorAll('input[name="priority"]');
    const successPopup = document.getElementById('successPopup');
    
    backArrow.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'dashboard.php';
    });

    function clearForm() {
        document.getElementById('list-name').value = '';
        document.getElementById('due-date').value = '';
        priorityRadios.forEach(radio => {
            radio.checked = false;
            radio.parentElement.classList.remove('active');
        });
        document.querySelector('input[name="default"]').checked = false;
    }

    clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        clearForm();
    });

    priorityRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            priorityRadios.forEach(r => r.parentElement.classList.remove('active'));
            if (this.checked) {
                this.parentElement.classList.add('active');
            }
        });
    });

    addListForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        fetch(addListForm.action, {
            method: 'POST',
            body: new FormData(addListForm)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage(data.message);
                clearForm(); // Clear the form after successful submission
            } else {
                console.error(data.error);
                alert('Error: ' + data.error); // Show error message to user
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.'); // Show generic error message to user
        });
    });

    function showSuccessMessage(message) {
        const successMessageElement = document.getElementById('successMessage');
        successMessageElement.textContent = message;
        successPopup.style.display = 'block';
        
        // Set a timeout to hide the popup and redirect to dashboard after 3 seconds
        setTimeout(() => {
            successPopup.style.opacity = '0';
            setTimeout(() => {
                successPopup.style.display = 'none';
                successPopup.style.opacity = '1';
                window.location.href = 'dashboard.php'; // Redirect to dashboard
            }, 300); // Short delay for fade-out effect
        }, 3000); // 3 seconds delay
    }
});
