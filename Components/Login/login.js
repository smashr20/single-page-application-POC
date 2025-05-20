(function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleSubmit);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.elements['email'].value.trim();
        const password = form.elements['password'].value;

        apiCall('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(data => {
            // Save login state and redirect to dashboard
            localStorage.setItem('isLoggedin', 'true');
            window.location.hash = '#dashboard';
        })
        .catch(err => {
            alert('Login failed: ' + err.message);
        });
    }
})();