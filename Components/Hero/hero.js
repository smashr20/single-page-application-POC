(function() {
    const searchContainer = document.getElementById('search-container');
    const joinUsBanner = document.getElementById('join-us-banner');

    // Function to update banner text based on hash
    const updateBannerText = () => {
        if (!joinUsBanner) return;
        const hash = window.location.hash.slice(1) || 'home';
        let bannerText = 'Join Us';
        if (hash === 'login') bannerText = 'Login';
        else if (hash === 'signup') bannerText = 'Getting Started with the vocals is quick and easy.<br>How would you like to join us?';
        else if (hash === 'register') bannerText = 'Join Us';
        joinUsBanner.querySelector('h1').innerHTML  = bannerText;
    };

    // Function to control visibility based on hash
    const updateHeroVisibility = () => {
        const hash = window.location.hash.slice(1) || 'home';
        // Hashes that show search
        const showSearchRoutes = ['home', 'search', 'booking'];
        // Hashes that show join us banner
        const showBannerRoutes = ['', 'signup', 'register'];

        if (searchContainer) {
            searchContainer.style.display = showSearchRoutes.includes(hash) ? 'flex' : 'none';
        }
        if (joinUsBanner) {
            joinUsBanner.style.display = showBannerRoutes.includes(hash) ? 'flex' : 'none';
            if (showBannerRoutes.includes(hash)) updateBannerText();
        }
    };

    window.addEventListener('hashchange', updateHeroVisibility);
    updateHeroVisibility();
})();


