console.log("easyhire.js: Script started");

const showTalentDetails = (entertainer) => {
  console.log("easyhire.js: Showing details for:", entertainer.name);
  const modal = document.getElementById("talentModal");
  const modalDetails = document.getElementById("modalTalentDetails");
  if (!modal || !modalDetails) {
    console.error("easyhire.js: Modal or modal details element not found");
    return;
  }

  // Construct full address
  const fullAddress = [
    entertainer.address,
    entertainer.state,
    entertainer.country,
    entertainer.postcode
  ]
    .filter(Boolean)
    .join(", ");

  // Populate modal with all entertainer details and Book Now button
  const photoUrl = entertainer.profilePhoto
    ? `https://single-page-application-poc-1.onrender.com${entertainer.profilePhoto}`
    : "https://t3.ftcdn.net/jpg/05/79/68/24/360_F_579682465_CBq4AWAFmFT1otwioF5X327rCjkVICyH.jpg";
  modalDetails.innerHTML = `
    <div style="text-align: center;">
      <img src="${photoUrl}" alt="${entertainer.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
      <h2>${entertainer.name}</h2>
      <p><strong>Role:</strong> ${entertainer.role}</p>
      <p><strong>Address:</strong> ${fullAddress || "Not provided"}</p>
      <p><strong>Mobile:</strong> ${entertainer.mobile || "Not provided"}</p>
      <p><strong>Email:</strong> ${entertainer.email || "Not provided"}</p>
      <p><strong>Website:</strong> ${
        entertainer.website
          ? `<a href="${entertainer.website}" target="_blank">${entertainer.website}</a>`
          : "Not provided"
      }</p>
      <button id="bookNowBtn" style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #1e3a8a; color: white; border: none; border-radius: 4px; cursor: pointer;">Book Now</button>
    </div>
  `;

  // Show modal
  modal.style.display = "flex";

  // Handle Book Now button click
  const bookNowBtn = document.getElementById("bookNowBtn");
  if (bookNowBtn) {
    bookNowBtn.addEventListener("click", () => {
      console.log("easyhire.js: Book Now clicked for:", entertainer.name);
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user || !user.id) {
        console.log("easyhire.js: No user logged in, redirecting to login");
        alert("Please log in to book this talent.");
        window.location.hash = "#login";
        modal.style.display = "none";
        return;
      }
    if (user.role !== "customer") {
    alert("Only customers can book entertainers.");
    return;
  }
      // booking logic here
    // step 1
    const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const closeBookingModal = document.getElementById("closeBookingModal");

// Show booking modal
modal.style.display = "none";
bookingModal.style.display = "flex";

// Prefill hidden values if needed
let bookingData = {
  customerId: user.id,
  entertainerId: entertainer.id
};

// Close booking modal
if (closeBookingModal) {
  closeBookingModal.onclick = () => {
    bookingModal.style.display = "none";
  };
}

// Submit booking form
bookingForm.onsubmit = (e) => {
  e.preventDefault();
  const date = document.getElementById("bookingDate").value;
  const description = document.getElementById("bookingDescription").value;

  if (!date || !description) {
    return alert("Please fill out all booking details.");
  }

  const payload = {
    ...bookingData,
    bookingDate: date,
    description,
    status: "pending"
  };

  fetch("https://single-page-application-poc-1.onrender.com/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert("Booking successfully requested!");
        bookingModal.style.display = "none";
      } else {
        alert(data.error || "Failed to send booking.");
      }
    })
    .catch(err => {
      console.error("Booking API error:", err);
      alert("Server error while sending booking.");
    });
};

    });
  }

  // Close modal on close button click
  const closeBtn = document.getElementById("closeTalentModal");
  if (closeBtn) {
    closeBtn.onclick = () => {
      console.log("easyhire.js: Closing modal");
      modal.style.display = "none";
    };
  }

  // Close modal on click outside modal-content
  modal.onclick = (event) => {
    if (event.target === modal) {
      console.log("easyhire.js: Closing modal (outside click)");
      modal.style.display = "none";
    }
  };
};

const loadEntertainers = () => {
  console.log("easyhire.js: Loading entertainers");
  const talentGrid = document.getElementById("talent-grid");
  if (!talentGrid) {
    console.error("easyhire.js: Talent grid with id 'talent-grid' not found");
    return;
  }

  fetch("https://single-page-application-poc-1.onrender.com/api/entertainers", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      let entertainers = data.entertainers || [];

      // 🔍 Apply filters from localStorage if available
      const storedParams = localStorage.getItem("searchParams");
      if (storedParams) {
        const filters = JSON.parse(storedParams);
        const what = filters.what?.toLowerCase() || "";
        const where = filters.where?.toLowerCase() || "";

        entertainers = entertainers.filter(ent => {
          const matchesWhat =
            !what ||
            ent.name.toLowerCase().includes(what) ||
            ent.role.toLowerCase().includes(what);

          const matchesWhere =
            !where ||
            (ent.state && ent.state.toLowerCase().includes(where)) ||
            (ent.country && ent.country.toLowerCase().includes(where)) ||
            (ent.address && ent.address.toLowerCase().includes(where));

          return matchesWhat && matchesWhere;
        });

        console.log("easyhire.js: Filtered entertainers:", entertainers);
        localStorage.removeItem("searchParams"); // clear after use
      }

      // 🧹 Clear and render
      talentGrid.innerHTML = "";
      if (entertainers.length === 0) {
        talentGrid.innerHTML = `<p>No entertainers found.</p>`;
        return;
      }

      //  Render cards
      entertainers.forEach(entertainer => {
        const card = document.createElement("div");
        card.className = "talent-card";
        const photoUrl = entertainer.profilePhoto
          ? `https://single-page-application-poc-1.onrender.com${entertainer.profilePhoto}`
          : "https://t3.ftcdn.net/jpg/05/79/68/24/360_F_579682465_CBq4AWAFmFT1otwioF5X327rCjkVICyH.jpg";
        card.style.backgroundImage = `url('${photoUrl}')`;
        card.innerHTML = `
          <div class="talent-info">
            <h3>${entertainer.name}</h3>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${entertainer.state}</p>
            <p class="role">${entertainer.role}</p>
          </div>
        `;
        card.addEventListener("click", () => {
          showTalentDetails(entertainer);
        });
        talentGrid.appendChild(card);
      });
    })
    .catch(err => {
      console.error("easyhire.js: Error fetching entertainers:", err);
      talentGrid.innerHTML = `<p>Error loading talent. Please try again later.</p>`;
    });
};


document.addEventListener("DOMContentLoaded", () => {
  console.log("easyhire.js: DOMContentLoaded fired");

  const content = document.getElementById("content");
  if (content) {
    console.log("easyhire.js: Content element found, HTML:", content.innerHTML);
  } else {
    console.error("easyhire.js: Content element with id 'content' not found");
  }

  loadEntertainers();

  if (content) {
    console.log("easyhire.js: Setting up MutationObserver");
    const observer = new MutationObserver(() => {
      console.log("easyhire.js: MutationObserver detected DOM change, HTML:", content.innerHTML);
      loadEntertainers();
    });
    observer.observe(content, { childList: true, subtree: true });
  } else {
    console.log("easyhire.js: Retrying to find content element...");
    const interval = setInterval(() => {
      const retryContent = document.getElementById("content");
      if (retryContent) {
        console.log("easyhire.js: Content element found on retry, HTML:", retryContent.innerHTML);
        clearInterval(interval);
        loadEntertainers();
        const observer = new MutationObserver(() => {
          console.log("easyhire.js: MutationObserver detected DOM change, HTML:", retryContent.innerHTML);
          loadEntertainers();
        });
        observer.observe(retryContent, { childList: true, subtree: true });
      }
    }, 500);
    setTimeout(() => clearInterval(interval), 5000);
  }
});

console.log("easyhire.js: Document readyState:", document.readyState);
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log("easyhire.js: DOM already loaded, running loadEntertainers");
  loadEntertainers();
}