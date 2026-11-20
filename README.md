# AssessmentAge-Dr-Tsebe

A static website featuring a chronological age calculator and information resources for psychological, psychoeducational and psychometric assessment professionals.

This folder is a reconstruction of the Assessment Age homepage based on an October 2026 HTML file retrieved from the user's ChatGPT Library. It is not an exact export of the production Netlify deployment. The original Library file could be read but could not be materialized as raw bytes.

## Included

- `index.html`: reconstructed homepage layout and wording
- `styles.css`: reconstructed presentation rules (previous HTML contained inline CSS)
- `script.js`: calculator logic based on original source
- `favicon.svg`: replacement favicon (original asset was not available)
- `robots.txt` and `sitemap.xml`: starter versions for the homepage only

## Important gaps

- Earlier discussions mention `/psychological-test-age-ranges/` and `/test-age-guide/`. Their original source files were not recovered and are not included. Do not deploy this package over the existing live site without backing up the deployed files and resolving those pages first.
- Privacy policy, About, Contact and cookie-consent pages are not included.
- AdSense and analytics are not configured.
- The full original CSS, favicon and deployment configuration are not recovered.
- The calculation methods should be tested against documented age-calculation examples and the relevant assessment manuals before production use.

## Run locally

Open `index.html` in a browser or use a simple static server (`python3 -m http.server 8000`). No framework or build step is required.

## Deployment

Can be deployed as a static folder on Netlify after checking the missing pages and replacing placeholder assets. Existing production content should be exported and backed up first.
