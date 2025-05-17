document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.getElementById('search-container');
    
    // Function to check if search should be visible
    const updateSearchVisibility = () => {
        const hash = window.location.hash.slice(1) || 'home';
        
        // Define routes where search should be visible
        const showSearchRoutes = ['home', 'search', 'booking'];
        
        if (showSearchRoutes.includes(hash)) {
            searchContainer.style.display = 'flex';
        } else {
            searchContainer.style.display = 'none';
        }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', updateSearchVisibility);
    
    // Initial check
    updateSearchVisibility();
});