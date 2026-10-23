const screens = {
  home: document.getElementById("home"),
  browser: document.getElementById("browser"),
  feedback: document.getElementById("feedback"),
  thankYou: document.getElementById("thankYou")
};

const feedbackButton = document.getElementById("feedbackButton");
const backButton = document.getElementById("backButton");
const browserHomeButton = document.getElementById("browserHomeButton");
const openExternalButton = document.getElementById("openExternalButton");
const browserPageTitle = document.getElementById("browserPageTitle");
const browserStatus = document.getElementById("browserStatus");
const browserNotice = document.getElementById("browserNotice");
const siteFrame = document.getElementById("siteFrame");
const shopGoodwillFrame = document.getElementById("shopGoodwillFrame");

let inactivityTimer;
let thankYouTimer;
let currentUrl = "";
const INACTIVITY_MS = 60 * 1000; // 60 seconds

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
  resetInactivityTimer();
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    // Do not clear or navigate the iframe until the idle timeout actually expires.
    returnHome();
  }, INACTIVITY_MS);
}

function returnHome() {
  clearTimeout(inactivityTimer);
  clearTimeout(thankYouTimer);

  // Stop the prior page from continuing to run after returning home.
  siteFrame.src = "about:blank";
  shopGoodwillFrame.src = "about:blank";
  siteFrame.classList.remove("is-hidden");
  shopGoodwillFrame.classList.add("is-hidden");
  currentUrl = "";
  showScreen("home");
}

function openKioskWebsite(button) {
  const url = button.dataset.url;
  if (!url) return;

  currentUrl = url;
  const label = button.querySelector("span:last-child")?.textContent?.trim() || "Website";
  browserPageTitle.textContent = label;
  browserStatus.textContent = "Attempting to load embedded website…";
  browserNotice.classList.remove("is-error");
  browserNotice.textContent =
    "Some websites block embedding. If the page stays blank or shows an error, use “Open in Safari.” The kiosk cannot reliably monitor activity inside external pages.";
  openExternalButton.disabled = false;

  showScreen("browser");
  if (url.includes("shopgoodwill.com")) {
    // ShopGoodwill gets its own x-frame-bypass iframe; other destinations use the regular iframe.
    siteFrame.src = "about:blank";
    siteFrame.classList.add("is-hidden");
    shopGoodwillFrame.classList.remove("is-hidden");
    shopGoodwillFrame.src = url;
  } else {
    shopGoodwillFrame.src = "about:blank";
    shopGoodwillFrame.classList.add("is-hidden");
    siteFrame.classList.remove("is-hidden");
    siteFrame.src = url;
  }
}

document.querySelectorAll(".kiosk-button[data-url]").forEach(button => {
  button.addEventListener("click", () => {
    const url = button.dataset.url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
});
});

function updateEmbeddedLoadStatus() {
  // A load event does NOT prove the destination rendered successfully.
  if (currentUrl && screens.browser.classList.contains("active")) {
    browserStatus.textContent = "Page load attempted";
  }
}
siteFrame.addEventListener("load", updateEmbeddedLoadStatus);
shopGoodwillFrame.addEventListener("load", updateEmbeddedLoadStatus);

browserHomeButton.addEventListener("click", () => returnHome({ resetForm: true }));

openExternalButton.addEventListener("click", () => {
  if (!currentUrl) return;
  // This is an explicit fallback. Once Safari opens, this kiosk page cannot
  // force Safari back to the kiosk home screen or enforce its idle timeout.
  window.open(currentUrl, "_blank", "noopener,noreferrer");
});

feedbackButton.addEventListener("click", () => showScreen("feedback"));

backButton.addEventListener("click", () => {
  showScreen("home");
});

// Feedback is handled by the embedded Google Form. Google Forms records each
// response directly in the form's Responses tab (and linked response sheet, if set up).


// Events on the kiosk document reset the timer. Pointer/keyboard activity inside a
// cross-origin iframe does not bubble to this document, and external sites cannot
// be inspected due to browser same-origin security protections.
["touchstart", "click", "keydown", "scroll", "pointerdown"].forEach(eventName => {
  document.addEventListener(eventName, resetInactivityTimer, { passive: true });
});

// When the visitor returns to the kiosk tab, start a fresh idle period.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) resetInactivityTimer();
});

resetInactivityTimer();
