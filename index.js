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

// Updated utility function to load external HTML and CSS
function loadHTML(id, file) {
  const basePath = file.substring(0, file.lastIndexOf('/'));
  const componentName = file.split('/').pop().split('.')[0];
  const cssFile = `${basePath}/${componentName}.css`;
  const jsFile = `${basePath}/${componentName}.js`;

  // Load HTML
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      
      // Load associated CSS
      const existingLink = document.querySelector(`link[href="${cssFile}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssFile;
        document.head.appendChild(link);
      }

      // Load associated JS
      const existingScript = document.querySelector(`script[src="${jsFile}"]`);
      if (!existingScript) {
        fetch(jsFile, { method: 'HEAD' })
          .then(resp => {
            if (resp.ok) {
              const script = document.createElement('script');
              script.type = 'application/javascript';
              script.src = jsFile;
              document.body.appendChild(script);
            }
          });
      }
    })
    .catch(err => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = "<p>Error loading " + file + "</p>";
      }
    });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load static parts (header/footer)
loadHTML("header", "./components/Header/header.html");
loadHTML("footer", "./components/Footer/footer.html");
loadHTML("hero", "./components/Hero/hero.html");
loadHTML("intro", "./components/Intro/intro.html");
loadHTML("news", "./components/News/news.html");
loadHTML("booking", "./components/Booking/booking.html");
loadHTML("easyhire", "./components/Easyhire/easyhire.html");
loadHTML("register", "./components/Register/register.html");
loadHTML("dashboard", "./components/Dashboard/dashboard.html");
// Add this with your other loadHTML calls at the top

window.addEventListener("load", () => {
  // Check if user is logged in
  if (localStorage.getItem('isLoggedin') === 'true') {
    window.location.hash = '#dashboard';
  } else {
    loadPage();
  }
});

function loadPage() {
  const hash = location.hash.substring(1) || "error";
  loadHTML("content", `./components/${capitalizeFirstLetter(hash)}/${hash}.html`);

  // Define sections to hide for different routes
  const sectionVisibility = {
    'home': {
      hide: ["signup", "register"],
      show: ["hero", "intro", "news", "booking", "content"]
    },
    'login': {
      hide: ["intro", "news", "booking", "hero", "signup", "register"],
      show: ["content", "hero"]
    },
    'signup': {
      hide: ["intro", "news", "booking", "hero", "register"],
      show: ["hero", "content"]
    },
    'booking': {
      hide: ["intro", "news"],
      show: ["hero", "content"]
    },
    'profile': {
      hide: ["intro", "hero"],
      show: ["news", "booking", "content"]
    },
    'default': {
      hide: ["register"],
      show: ["hero", "intro", "news", "booking", "content"]
    },
    'dashboard': {
        hide: ["intro", "news", "booking", "signup", "register"],
        show: ["content", "hero"]
    },
    'register': {
        hide: ["intro", "news", "booking", "hero", "register"],
        show: ["content", "hero"]
    }
  };

  // Get the visibility configuration for current route
  const visibility = sectionVisibility[hash] || sectionVisibility.default;

  // Hide sections
  visibility.hide.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = "none";
    }
  });

  // Show sections
  visibility.show.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = "block";
    }
  });
}

window.addEventListener("hashchange", loadPage);
window.addEventListener("load", loadPage);

