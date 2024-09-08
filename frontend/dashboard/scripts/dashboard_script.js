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
});