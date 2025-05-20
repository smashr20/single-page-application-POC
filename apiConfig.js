/**
 * Common API call function with spinner support.
 * Usage: apiCall(url, options).then(data => { ... }).catch(err => { ... });
 */

function showSpinner() {
    // Hide all except header/footer, show spinner
    const spinner = document.getElementById('global-spinner');
    if (spinner) spinner.style.display = 'flex';

    // Hide all direct children of body except header/footer/spinner
    Array.from(document.body.children).forEach(child => {
        if (
            child.id !== 'header' &&
            child.id !== 'footer' &&
            child.id !== 'global-spinner'
        ) {
            child.style.display = 'none';
        }
    });
}

function hideSpinner() {
    // Show all except spinner
    const spinner = document.getElementById('global-spinner');
    if (spinner) spinner.style.display = 'none';

    Array.from(document.body.children).forEach(child => {
        if (
            child.id !== 'header' &&
            child.id !== 'footer' &&
            child.id !== 'global-spinner'
        ) {
            child.style.display = '';
        }
    });
}

const API_BASE_URL = 'http://localhost:3000'; // Update with your API base URL

/**
 * Makes an AJAX call and shows a spinner during the request.
 * @param {string} url - The API endpoint.
 * @param {object} options - Fetch options (method, headers, body, etc).
 * @returns {Promise<any>} - Resolves with response data or rejects with error.
 */
function apiCall(url, options = {}) {
    showSpinner();
     const fullUrl = API_BASE_URL + url;
    return fetch(fullUrl, options)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .finally(() => {
            hideSpinner();
        });
}

// Export for use in other scripts
window.apiCall = apiCall;