const screens = {
  home: document.getElementById("home"),
  feedback: document.getElementById("feedback"),
  thankYou: document.getElementById("thankYou")
};

const feedbackButton = document.getElementById("feedbackButton");
const backButton = document.getElementById("backButton");
const form = document.getElementById("feedbackForm");

// Google Form response endpoint.
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSd0xiBQHWXXbEcfjHdxOxIP16MrUiTtTnvHzyYyC81wpS84dw/formResponse";

let inactivityTimer;
const INACTIVITY_MS = 120000; // 2 minutes

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
  resetInactivityTimer();
  window.scrollTo(0, 0);
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    form.reset();
    showScreen("home");
  }, INACTIVITY_MS);
}

document.querySelectorAll(".kiosk-button[data-url]").forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = button.dataset.url;
  });
});

feedbackButton.addEventListener("click", () => showScreen("feedback"));

backButton.addEventListener("click", () => {
  form.reset();
  showScreen("home");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData();

  // These entry IDs come directly from the user's Google Form pre-filled URL.
  data.append("entry.155385695", form.elements.overall.value);
  data.append("entry.427306195", form.elements.staff.value);
  data.append("entry.1901359072", form.elements.store.value);
  data.append("entry.1664136257", form.elements.whatWentWell.value);
  data.append("entry.1229209812", form.elements.improve.value);
  data.append("entry.1090409566", form.elements.contact.value);
  data.append("entry.522384822", form.elements.contactInfo.value);

  try {
    // Google Forms accepts POST submissions to /formResponse.
    // no-cors is used because the kiosk page is hosted separately from Google.
    await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      mode: "no-cors",
      body: data
    });

    form.reset();
    showScreen("thankYou");

    setTimeout(() => showScreen("home"), 6000);
  } catch (error) {
    console.error("Feedback submission failed:", error);
    alert("We couldn't submit your feedback. Please try again.");
  }
});

["touchstart", "click", "keydown", "scroll"].forEach(eventName => {
  document.addEventListener(eventName, resetInactivityTimer, { passive: true });
});

resetInactivityTimer();
