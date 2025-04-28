// Mock user object for login validation
const mockUser = {
    username: "user",
    password: "1234",
};

// Login function to validate username and password
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === mockUser.username && password === mockUser.password) {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("profilePage").classList.remove("hidden");

        fetchUserProfile();
    } else {
        alert("Invalid username or password!");
    }
}

// Function to fetch and display user profiles
function fetchUserProfile() {
    console.log("Fetching user profiles...");

    fetch("http://localhost:3000/api/users")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched user data:", data);

            if (Array.isArray(data) && data.length > 0) {
                // Sort users by credit score (ascending order)
                data.sort((a, b) => a.creditScore - b.creditScore);

                const profilesContainer = document.getElementById("profilesContainer");
                profilesContainer.innerHTML = ''; // Clear previous profiles

                data.forEach(user => {
                    const { name, bank, creditScore, lastBankUsed } = user;

                    if (name && bank && creditScore !== undefined) {
                        let creditCategory = creditScore >= 700 ? "Good" :
                                             creditScore >= 500 ? "Average" : "Poor";

                        // Create profile box
                        const profileBox = document.createElement("div");
                        profileBox.classList.add("profile-box");
                        profileBox.innerHTML = `
                            <h3>${name}</h3>
                            <p><strong>Bank:</strong> ${bank}</p>
                            <p><strong>Credit Score:</strong> ${creditScore} (${creditCategory})</p>
                        `;

                        // Add click event to show last bank used
                        profileBox.addEventListener("click", () => {
                            showLastBankUsed(name, lastBankUsed);
                        });

                        profilesContainer.appendChild(profileBox);
                    }
                });
            } else {
                throw new Error("No valid data received.");
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("There was an issue loading your profile. Please try again later.");
        });
}

// Function to show last bank used
function showLastBankUsed(userName, lastBank) {
    const lastBankContainer = document.getElementById("lastBankUsed");
    
    if (lastBank && lastBank.trim() !== "" && lastBank !== "null") { 
        lastBankContainer.innerHTML = `<h3>Last Bank Used by ${userName}: ${lastBank}</h3>`;
    } else {
        lastBankContainer.innerHTML = `<h3>No last bank used by ${userName}.</h3>`;
    }
}



// Logout function to show the login page again
function logout() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("profilePage").classList.add("hidden");
    document.getElementById("lastBankUsed").innerHTML = ''; // Clear last bank used info
}
