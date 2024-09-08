document.addEventListener('DOMContentLoaded', function() {
    const backArrow = document.querySelector('.back-arrow');
    
    backArrow.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'dashboard.php';
    });

    // New function for clearing the form
    function clearForm() {
        // Reset list name
        document.getElementById('list-name').value = '';

        // Reset due date to default (2024-09-06)
        document.getElementById('due-date').value = '2024-09-06';

        // Uncheck all priority radio buttons
        const priorityRadios = document.querySelectorAll('input[name="priority"]');
        priorityRadios.forEach(radio => radio.checked = false);

        // Uncheck the "Make it default" checkbox
        document.querySelector('input[name="default"]').checked = false;
    }

    // Add event listener to the Clear List button
    const clearButton = document.querySelector('.btn-secondary');
    clearButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission
        clearForm();
    });
});
