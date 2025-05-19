document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your login validation here
    
    // After successful login, redirect to dashboard
    window.location.hash = 'dashboard';
});