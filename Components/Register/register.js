console.log("register.js: Script started");

function init() {
  console.log("register.js: Initializing script");

  // Check if already logged in (with private browsing fallback)
  try {
    const isLoggedIn = localStorage.getItem("isLoggedin") === "true";
    if (isLoggedIn) {
      console.log("register.js: User already logged in, redirecting to dashboard");
      window.location.href = "/dashboard.html";
      return;
    }
  } catch (e) {
    console.warn("register.js: LocalStorage access error (private browsing?)", e);
  }

  const form = document.querySelector(".registration-form");
  if (!form) {
    console.error("register.js: Form with class 'registration-form' not found");
    return;
  }
  console.log("register.js: Form found:", form);

  // Form submission handler
  async function handleFormSubmit(event) {
    event.preventDefault();
    console.log("register.js: Form submit event triggered");

    const submitButton = form.querySelector(".save-btn");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Processing...";
    }

    try {
      const formData = {
        name: document.getElementById("name")?.value.trim() || "",
        address: document.getElementById("address")?.value.trim() || "",
        country: document.getElementById("country")?.value.trim() || "",
        state: document.getElementById("state")?.value.trim() || "",
        postcode: document.getElementById("postcode")?.value.trim() || "",
        mobile: document.getElementById("mobile")?.value.trim() || "",
        email: document.getElementById("email")?.value.trim() || "",
        password: document.getElementById("password")?.value || "",
        confirmPassword: document.getElementById("confirmPassword")?.value || "",
        website: document.getElementById("website")?.value.trim() || "",
        role: document.getElementById("role")?.value || "customer",
      };

      // Client-side validation
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      console.log("register.js: Submitting to /api/signup", formData);

      const response = await fetch("https://single-page-application-poc.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("register.js: Server response:", data);

      if (data.message) {
        try {
          localStorage.setItem("loggedInUser", JSON.stringify(data.user));
          localStorage.setItem("isLoggedin", "true");
        } catch (e) {
          console.warn("register.js: Could not save to localStorage", e);
        }
        alert("Registration successful!");
        window.location.href = "/dashboard.html";
      } else {
        throw new Error(data.error || "Unknown server error");
      }
    } catch (err) {
      console.error("register.js: Error during registration:", err);
      alert(`Error: ${err.message}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Save & Register";
      }
    }
  }

  // Set up form submission
  form.addEventListener("submit", handleFormSubmit);

  // Button click handler (for debugging)
  const button = document.querySelector(".save-btn");
  if (button) {
    console.log("register.js: Button found:", button);
    button.addEventListener("click", (event) => {
      console.log("register.js: Button clicked, triggering form submission");
      form.requestSubmit();
    });
  } else {
    console.error("register.js: Button with class 'save-btn' not found");
  }
}

// Initialize when DOM is ready
if (document.readyState === "complete" || document.readyState === "interactive") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}