/* EcoBite configuration. Edit this file only; no build step is required. */
window.ECO_CONFIG = {
  version: "1.0.0",
  // Conversion used by the carbon impact calculator: 46.8 kg CO2e = 185 km (ratio taken from the framework document).
  kgCO2ePerKm: 46.8 / 185,
  // Learning pass mark for every mini-game also needs clinical integrity >= 80 (Sustainable Value Engine rule).
  clinicalFloor: 80,
  // Optional: POST anonymised results (alias, scores) to your own endpoint, for example a Google Apps Script web app.
  // Leave null to keep everything inside the browser / LMS gradebook.
  leaderboardEndpoint: null,
  // Instructors: set true to unlock every level for preview and testing.
  unlockAll: false
};
