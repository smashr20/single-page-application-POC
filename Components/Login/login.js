
// Define attachListeners at top level Just for file changes
const attachListeners = () => {
  console.log("login.js: Running attachListeners");
  const form = document.getElementById("login-form");
  if (form) {
    console.log("login.js: Form found:", form);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("login.js: Login button clicked (submit eventttt)!");

      const email = document.getElementById("login_email").value;
      const password = document.getElementById("login_password").value;

      fetch("api/user-login.php", {
     // fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            console.log("login.js: Login successful:", data.user);
            alert("Welcome, " + data.user.name + "!");
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            localStorage.setItem("isLoggedin", "true");
           if (data.user.role === "admin") {
  history.pushState({}, "", "/admin.html");
      window.location.href = "/admin.html";  // This will reload the page

} else {
  history.pushState({}, "", "/dashboard.html");
    window.location.href = "/dashboard.html";  // This will reload the page

}
          }
           else {
            console.warn("login.js: Login failed:", data.error);
            alert("Login failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(err => {
          console.error("login.js: Network or server error:", err);
          alert("Login error. Please try again.");
        });
    });
  } else {
    console.error("login.js: Form with id 'login-form' not found");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("login.js: DOMContentLoaded fired");

  const content = document.getElementById("content");
  if (content) {
    console.log("login.js: Content element found, HTML:", content.innerHTML);
  } else {
    console.error("login.js: Content element with id 'content' not found");
  }

  attachListeners();

  if (content) {
    console.log("login.js: Setting up MutationObserver");
    const observer = new MutationObserver(() => {
      console.log("login.js: MutationObserver detected DOM change, HTML:", content.innerHTML);
      attachListeners();
    });
    observer.observe(content, { childList: true, subtree: true });
  } else {
    console.error("login.js: Cannot set up MutationObserver, content not found");
  }
});

// Check if DOM is already loaded
console.log("login.js: Document readyState:", document.readyState);
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log("login.js: DOM already loaded, running attachListeners");
  attachListeners();
}
