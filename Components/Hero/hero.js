console.log("hero.js: Script started");

const attachSearchListeners = () => {
  console.log("hero.js: Running attachSearchListeners");
  const form = document.getElementById("search-container");
  if (form) {
    console.log("hero.js: Search form found:", form);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("hero.js: Search form submitted");

      const formData = new FormData(form);
      const searchParams = {
        what: formData.get("what"),
        classification: formData.get("classification"),
        where: formData.get("where")
      };

      console.log("hero.js: Search parameters:", searchParams);

      // Store search parameters in localStorage for easyhire.js
      localStorage.setItem("searchParams", JSON.stringify(searchParams));

      // Navigate to #easyhire
      console.log("hero.js: Redirecting to #easyhire");
      window.location.hash = "#easyhire";
    });
  } else {
    console.error("hero.js: Form with id 'search-container' not found");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("hero.js: DOMContentLoaded fired");

  const content = document.getElementById("content");
  if (content) {
    console.log("hero.js: Content element found, HTML:", content.innerHTML);
  } else {
    console.error("hero.js: Content element with id 'content' not found");
  }

  attachSearchListeners();

  if (content) {
    console.log("hero.js: Setting up MutationObserver");
    const observer = new MutationObserver(() => {
      console.log("hero.js: MutationObserver detected DOM change, HTML:", content.innerHTML);
      attachSearchListeners();
    });
    observer.observe(content, { childList: true, subtree: true });
  } else {
    console.log("hero.js: Retrying to find content element...");
    const interval = setInterval(() => {
      const retryContent = document.getElementById("content");
      if (retryContent) {
        console.log("hero.js: Content element found on retry, HTML:", retryContent.innerHTML);
        clearInterval(interval);
        attachSearchListeners();
        const observer = new MutationObserver(() => {
          console.log("hero.js: MutationObserver detected DOM change, HTML:", retryContent.innerHTML);
          attachSearchListeners();
        });
        observer.observe(retryContent, { childList: true, subtree: true });
      }
    }, 500);
    setTimeout(() => clearInterval(interval), 5000);
  }
});

console.log("hero.js: Document readyState:", document.readyState);
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log("hero.js: DOM already loaded, running attachSearchListeners");
  attachSearchListeners();
}