document.addEventListener('DOMContentLoaded', function() {
    const backArrow = document.querySelector('.back-arrow');
    const addListForm = document.getElementById('addListForm');
    const clearButton = document.querySelector('.btn-secondary');
    const priorityRadios = document.querySelectorAll('input[name="priority"]');
    const successPopup = document.getElementById('successPopup');

    // Set default date to "September 06, 2024"
    const dueDateInput = document.getElementById('due-date');
    dueDateInput.value = '2024-09-06'; // Set the value to match the format expected by the input

    backArrow.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'dashboard.php';
    });

    function clearForm() {
        document.getElementById('list-name').value = '';
        dueDateInput.value = '2024-09-06'; // Reset to default date
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
                clearForm();
            } else {
                console.error(data.error);
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        });
    });

    function showSuccessMessage(message) {
        const successMessageElement = document.getElementById('successMessage');
        successMessageElement.textContent = message;
        successPopup.style.display = 'block';
        
        setTimeout(() => {
            successPopup.style.opacity = '0';
            setTimeout(() => {
                successPopup.style.display = 'none';
                successPopup.style.opacity = '1';
                window.location.href = 'dashboard.php';
            }, 300);
        }, 3000);
    }
});