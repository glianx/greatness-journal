/* ───────────────────────────────────────────────────────────────────────────
   410 Days landing page: the only file you need to edit.
   ─────────────────────────────────────────────────────────────────────────── */
window.SITE_CONFIG = {
  // Public TestFlight link. Leave "" until it exists: the "Join the TestFlight beta"
  // buttons then scroll to the email form instead. Paste it in and every button goes to TestFlight.
  TESTFLIGHT_URL: "",              // e.g. "https://testflight.apple.com/join/AbCdEfGh"

  // App Store link, once 1.0 is live. When set, the page shows a "Download on the App Store" button too.
  APP_STORE_URL: "",

  // Where signups go. FormSubmit needs no account: the first signup sends Gordon a one-time
  // "Activate form" email, and after he clicks it every signup lands in his inbox.
  // Swap for a Formspree / Tally / Google Apps Script URL any time. The page POSTs JSON to it.
  // Set to "" to use the email (mailto) fallback only.
  FORM_ENDPOINT: "https://formsubmit.co/ajax/gordon@liang.ca",

  CONTACT_EMAIL: "gordon@liang.ca",

  // Canonical address of this page, used for share links. Update if you move it.
  SITE_URL: "https://glianx.github.io/greatness-journal/",
};
