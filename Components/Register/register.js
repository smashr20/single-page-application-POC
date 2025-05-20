function registerAs(userType) {
    sessionStorage.setItem('userType', userType);
    window.location.hash = 'register';
}