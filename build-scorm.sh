#!/usr/bin/env bash
# Builds dist/ecobite-scorm12.zip for Moodle (Add activity > SCORM package).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
rm -f dist/ecobite-scorm12.zip
zip -r -X dist/ecobite-scorm12.zip imsmanifest.xml index.html css js
echo "Built dist/ecobite-scorm12.zip"
