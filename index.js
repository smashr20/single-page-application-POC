// Utility function to load HTML, CSS, and JS
async function loadHTML(id, file, callback) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}: ${response.status}`);
    const data = await response.text();
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with ID ${id} not found`);
    element.innerHTML = data;

    const basePath = file.substring(0, file.lastIndexOf('/'));
    const componentName = file.split('/').pop().split('.')[0];
    const cssFile = `${basePath}/${componentName}.css`;
    const jsFile = `${basePath}/${componentName}.js`;

    if (!document.querySelector(`link[href="${cssFile}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssFile;
      document.head.appendChild(link);
    }

    const jsResponse = await fetch(jsFile, { method: 'HEAD' });
    if (jsResponse.ok && !document.querySelector(`script[src="${jsFile}"]`)) {
      const script = document.createElement('script');
      script.src = jsFile;
      document.body.appendChild(script);
    }

    if (callback) callback();
  } catch (err) {
    console.error(`Error loading ${file}:`, err);
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = `<p>Error loading page. Please try again or return to <a href="#home">Home</a>.</p>`;
    } else {
      window.location.hash = "#home";
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateHeaderLinksForLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedin") === "true";
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const elements = {
    signInLink: document.getElementById("nav-signin"),
    signUpLink: document.getElementById("nav-signup"),
    addListingLink: document.getElementById("nav-listing"),
    userInfo: document.getElementById("user-info"),
    userName: document.getElementById("user-name"),
    profileImg: document.getElementById("profile-img-header"),
    logoutBtn: document.getElementById("logout-btn")
  };

  if (isLoggedIn && user.name) {
    if (elements.signInLink) elements.signInLink.style.display = "none";
    if (elements.signUpLink) elements.signUpLink.style.display = "none";
    if (elements.addListingLink && user.role !== "customer") {
      elements.addListingLink.style.display = "inline-block";
    } else if (elements.addListingLink) {
      elements.addListingLink.style.display = "none";
    }
    if (elements.userInfo && elements.userName) {
      elements.userInfo.style.display = "flex";
      elements.userName.textContent = user.name;
    }
  } else {
    if (elements.signInLink) elements.signInLink.style.display = "inline-block";
    if (elements.signUpLink) elements.signUpLink.style.display = "inline-block";
    if (elements.addListingLink) elements.addListingLink.style.display = "inline-block";
    if (elements.userInfo) elements.userInfo.style.display = "none";
  }

  if (elements.profileImg) {
    elements.profileImg.style.cursor = "pointer";
    elements.profileImg.onclick = () => {
      window.location.hash = "#dashboard";
    };
  }

  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("isLoggedin");
      window.location.hash = "#login";
      updateHeaderLinksForLogin();
    });
  }
}

async function initializeApp() {
  await Promise.all([
    loadHTML("header", "./components/Header/header.html", updateHeaderLinksForLogin),
    loadHTML("footer", "./components/Footer/footer.html"),
    loadHTML("hero", "./components/Hero/hero.html"),
    loadHTML("intro", "./components/Intro/intro.html")
  ]);

  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const isLoggedIn = localStorage.getItem("isLoggedin") === "true";
  const restrictedRoles = ["entertainer", "bands", "celebrities", "services", "speakers"];

  if (isLoggedIn) {
    if (user.role === "admin") {
      window.location.href = "/admin.html";
      return;
    }
    if (restrictedRoles.includes(user.role)) {
      window.location.hash = "#dashboard";
    }
  }

  loadPage();
}

function loadPage() {
  console.log("Loading page for hash:", window.location.hash);
  let hash = window.location.hash.substring(1);
  if (!hash || hash === "/") hash = "home";

  const pageMap = {
    'dashboard': './components/Dashboard/dashboard.html',
    'home': './components/Home/home.html',
    'login': './components/Login/login.html',
    'signup': './components/Signup/signup.html'
    // Add other pages here
  };

  const file = pageMap[hash] || `./components/${capitalizeFirstLetter(hash)}/${hash}.html`;
  loadHTML("content", file);

  const sectionVisibility = {
    'home': {
      hide: ["signup", "register"],
      show: ["hero", "intro", "news", "booking", "content"]
    },
    'login': {
      hide: ["intro", "news", "booking", "signup", "register"],
      show: ["content", "hero"]
    },
    'signup': {
      hide: ["intro", "news", "booking", "register"],
      show: ["hero", "content"]
    },
    'dashboard': {
      hide: ["intro", "news", "booking", "hero", "signup", "register"],
      show: ["content"]
    }
  };

  const visibility = sectionVisibility[hash] || sectionVisibility.home;

  visibility.hide.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  visibility.show.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  });

  updateHeaderLinksForLogin();
}

window.addEventListener("load", initializeApp);
window.addEventListener("hashchange", loadPage);