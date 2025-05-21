console.log("register.js: Script started"); // Debug: Confirm script starts


  console.log("register.js: DOMContentLoaded fired"); // Debug: Confirm DOM is loaded
  const form = document.querySelector(".registration-form");
  if (form) {
    console.log("register.js: Form found:", form); // Debug: Confirm form is found
   form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("register.js: Submitting to /api/signup");

  const formData = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    postcode: document.getElementById("postcode").value,
    mobile: document.getElementById("mobile").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    confirmPassword: document.getElementById("confirmPassword").value,
    website: document.getElementById("website").value,
    role: document.getElementById("role")?.value || "customer" // default to customer
  };

  fetch("http://localhost:3000/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      console.log("data",data);
       localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      localStorage.setItem("isLoggedin", "true");

      console.log("register.js: Signup successful");
      alert("Registration successful!");
      // form.reset();
    history.pushState({}, "", "/dashboard.html");
    window.location.href = "/dashboard.html";  // This will reload the page
    } else {
      console.warn("register.js: Server error", data.error);
      alert("Error: " + (data.error || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("register.js: Network error", err);
    alert("Network error. Try again later.");
  });
});

    // Additional debug: Log button click directly
    const button = document.querySelector(".save-btn");
    if (button) {
      console.log("register.js: Button found:", button); // Debug: Confirm button is found
      button.addEventListener("click", () => {
        console.log("register.js: Save & Register button clicked (direct click event)!"); // Debug: Confirm button click
      });
    } else {
      console.error("register.js: Button with class 'save-btn' not found");
    }
  } else {
    console.error("register.js: Form with class 'registration-form' not found");
  }