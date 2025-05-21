
// Updated utility function to load external HTML and CSS
function loadHTML(id, file, callback) {
  const basePath = file.substring(0, file.lastIndexOf('/'));
  const componentName = file.split('/').pop().split('.')[0];
  const cssFile = `${basePath}/${componentName}.css`;
  const jsFile = `${basePath}/${componentName}.js`;

  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      if (callback) callback(); // ✅ Callback after HTML loads

      const existingLink = document.querySelector(`link[href="${cssFile}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile;
        document.head.appendChild(link);
      }

      const existingScript = document.querySelector(`script[src="${jsFile}"]`);
      if (!existingScript) {
        fetch(jsFile, { method: 'HEAD' }).then(resp => {
          if (resp.ok) {
            const script = document.createElement('script');
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

function updateHeaderLinksForLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedin") === "true";
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const signInLink = document.getElementById("nav-signin");
  const signUpLink = document.getElementById("nav-signup");
  const addListingLink = document.getElementById("nav-listing");

  const userInfo = document.getElementById("user-info");
  const userName = document.getElementById("user-name");

  if (isLoggedIn && user) {
    if (signInLink) signInLink.style.display = "none";
    if (signUpLink) signUpLink.style.display = "none";
    if (addListingLink) addListingLink.style.display = "none";

    if (userInfo && userName) {
      userInfo.style.display = "flex";
      userName.textContent = `${user.name}`;
    }
  } else {
    if (signInLink) signInLink.style.display = "inline-block";
    if (signUpLink) signUpLink.style.display = "inline-block";
    if (addListingLink) addListingLink.style.display = "inline-block";

    if (userInfo) userInfo.style.display = "none";
  }
  const profileImg = document.getElementById("profile-img-header");
if (profileImg) {
  profileImg.style.cursor = "pointer"; // optional: make it look clickable
  profileImg.onclick = () => {
    window.location.hash = "#dashboard";
  };
}

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    console.log("Logging out...");
    // Clear session
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedin");

    // Redirect to home or login
    window.location.hash = "#login";

    // Refresh header and UI
    updateHeaderLinksForLogin();
  });
}

}




// Load static parts (header/footer)
loadHTML("header", "./components/Header/header.html", updateHeaderLinksForLogin);
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

