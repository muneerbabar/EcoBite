# EcoBite: The Planetary Practitioner

A serious clinical simulation that turns planetary health awareness into chairside, clinic and policy competence. Five tiers, 15 missions, no build step, no dependencies.

| Orbit | Tier | Missions |
|---|---|---|
| 1 | Novice: Waste & Materials Warden | Sorting speed-run, pouch splitter and SUP audit, Minamata and LCA matrix |
| 2 | Intermediate: Chairside Eco-Clinician | Restorative cycle, digital vs analogue, nitrous oxide stewardship |
| 3 | Advanced: Care Pathway Architect | Calendar block scheduling, ecosystemic consultation, antimicrobial stewardship |
| 4 | Expert: Green Clinic Director | SusQI audit, Doughnut Economics clinic, PHRC and MY PLANET simulator |
| 5 | Master: Planetary Health Pioneer | Amalgam treaty, Scope 3 decarbonisation, One Health equity |

Core rule (Sustainable Value Engine): Sustainable Value = (Clinical Outcomes + Social Impact) / (Financial Costs + Environmental Harm). Every mission keeps Clinical Health Integrity (must stay at 80% or above), Clinic Budget and Planetary Footprint on screen. Missions pass at a score of 70 or more with the benchmark met.

## Run locally
Open `index.html` through any static server, for example `python3 -m http.server` then visit http://localhost:8000. Add `?unlock=all` to unlock every orbit for review.

## GitHub
1. Create a repository and push this folder to `main`.
2. In Settings > Pages, set Source to GitHub Actions. The included workflow publishes the site and attaches `ecobite-scorm12.zip`.

## Moodle
1. Run `./scripts/build-scorm.sh` (or download `ecobite-scorm12.zip` from the published site).
2. In Moodle: Add an activity > SCORM package > upload the zip.
3. Suggested settings: Grading method "Highest grade"; Maximum grade 100; Completion "Require status: Passed". Mastery score is 70.

Reported to the gradebook: score (average of the best score in all 15 missions, 0 to 100), lesson status (`incomplete` until all missions pass, then `passed`), location and suspend data (progress, alias, untimed setting). The e-portfolio reflections stay in the learner's browser and are exported as a file.

Alternative: embed the GitHub Pages URL with Moodle's URL resource or an iframe in a Page. Progress then saves in the browser only, not in the gradebook.

## Configuration (`js/config.js`)
- `kgCO2ePerKm`: conversion for the carbon calculator.
- `leaderboardEndpoint`: optional POST endpoint (for example a Google Apps Script web app) for anonymised results. Left `null` by default.
- `unlockAll`: preview mode for instructors.

## Content and evidence
Benchmarks come from the EcoBite framework document. Scenario quantities are simplified teaching parameters. Please verify framework figures (for example the 64.5% travel share, 71% Scope 3 share, 354 g SUP benchmark and 2034 amalgam date) against primary sources before external publication. Content lives in `js/data1.js` and `js/data2.js`; engines in `js/engines.js`.

## Known limits
- The leaderboard shows illustrative cohort rows. A real cohort board needs a backend or the LMS gradebook.
- The portfolio checksum is tamper-evident, not a cryptographic signature.
- SCORM 1.2 suspend data is capped at about 4 KB, so reflections are not stored in the LMS.
