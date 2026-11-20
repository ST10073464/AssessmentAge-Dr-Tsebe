# AssessmentAge-Dr-Tsebe

A static website featuring a chronological age calculator and information resources for psychological, psychoeducational and psychometric assessment professionals.

This folder is a reconstruction of the Assessment Age homepage based on an October 2026 HTML file retrieved from the user's ChatGPT Library. It is not an exact export of the production Netlify deployment. The original Library file could be read but could not be materialized as raw bytes.

## Included

- `index.html`: reconstructed homepage layout and wording
- `contact.html`: contact form for an email address and message
- `contact-thanks.html`: form submission confirmation page
- `styles.css`: reconstructed presentation rules (previous HTML contained inline CSS)
- `script.js`: calculator logic based on original source
- `favicon.svg`: replacement favicon (original asset was not available)
- `robots.txt` and `sitemap.xml`: starter versions for the homepage and contact page

## Important gaps

- Earlier discussions mention `/psychological-test-age-ranges/` and `/test-age-guide/`. Their original source files were not recovered and are not included. Do not deploy this package over the existing live site without backing up the deployed files and resolving those pages first.
- A full Privacy Policy, About page and cookie-consent flow are not included. The ad placeholders are hidden.
- Analytics is not configured. No traffic is collected by this source yet.
- The full original CSS and favicon are not recovered.
- The calculation methods should be tested against documented age-calculation examples and the relevant assessment manuals before production use.

## Run locally in VS Code

1. Open this folder in VS Code.
2. Open `index.html` directly in a browser, or start a local server from the VS Code terminal:

   ```powershell
   py -m http.server 8000
   ```

3. Visit `http://localhost:8000` in your browser. Stop the server with `Ctrl+C` in the terminal.

The site is plain HTML, CSS and JavaScript. It has no package installation or build step. The calculator runs in the browser, and its date values are not sent to a server.

## Contact form test

The static contact form uses FormSubmit.co to forward messages to `assessmentage@gmail.com` and send an automatic acknowledgement to the visitor. FormSubmit is a third-party service; it is not an Azure service. Its current free service requires no registration, and it says submissions are retained for 30 days. The form only asks for an email address and message. Do not include client identities, dates of birth, test results, or confidential assessment information.

To test, start the local server using the steps above and open `http://localhost:8000/contact.html` (a `file://` URL will not work). Submit a test message. The first submission may trigger an activation email to `assessmentage@gmail.com`; click its verification link. That first submission might not yet deliver the expected confirmation to the sender, so submit another test after activating the address. Do not use real client information while testing.

No test message has been submitted from this project, and the site has not been hosted or deployed. Before public use, review FormSubmit's current terms and privacy details and replace this provider if it does not meet the site owner's requirements.

## Using the calculator

- Enter the date of birth and the date the assessment took place. Dates can be typed as `DD/MM/YYYY` or as eight digits; for example, `19851118` is formatted as `18/11/1985`. The calendar icon can also be used to choose either date.
- **Set assessment date to today** changes only the assessment date. For an assessment that happened earlier, enter the actual test date.
- The result is chronological age on the assessment date. It helps you apply the age rules in the relevant assessment manual; it does not measure development, diagnose, or score a test.
- Choose the calculation convention specified by the assessment manual. The selected convention is shown with the result and copied report text. If you are unsure, check the manual before using the result in a report.
- Use **Copy result for report** to copy the age and selected convention. Use **Clear** to start again.

## Azure hosting and traffic-report plan

This site is currently plain HTML, CSS, and JavaScript. Azure Static Web Apps is the better fit for this version because it hosts static sites and can deploy from the GitHub repository. An ASP.NET Core MVC project would fit Azure App Service, but the current calculator does not need a server or database. To build MVC skills for a portfolio, a separate MVC project would demonstrate that experience without adding unnecessary server code here.

For monthly page-visit reports, the Azure route is Application Insights with its browser JavaScript SDK. That requires an Azure resource, a connection string, and an agreed privacy notice. This repository currently collects no visitor analytics. After setup, page views can be queried over a monthly date range in Application Insights.

No Azure resources or deployment workflow have been created, and nothing has been deployed. Keep the current production site and domain at the existing host until the site owner approves the migration and missing pages are resolved.

Do not replace the current production site until its existing pages have been backed up and missing pages resolved. The original site is hosted separately; this folder is a reconstructed starter source package.
