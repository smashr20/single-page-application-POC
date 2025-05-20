function registerAs(userType) {
    localStorage.setItem('userType', userType);
    window.location.hash = 'register';
}