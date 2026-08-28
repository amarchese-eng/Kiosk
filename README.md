# Goodwill of North Florida Kiosk v2

This version connects the custom feedback form to the provided Google Form.

Google Form:
https://docs.google.com/forms/d/e/1FAIpQLSd0xiBQHWXXbEcfjHdxOxIP16MrUiTtTnvHzyYyC81wpS84dw/viewform

## Test
Open index.html in a browser and submit a test response. Then check the Google Form Responses tab / linked Google Sheet.

## Important
Google Forms uses a cross-origin POST, so the browser cannot verify the response body. The kiosk displays the thank-you screen after the POST request is sent. Confirm the first test response appears in the Google Form before deploying to the iPad.

Next:
- Configure email notifications for new responses.
- Add the Goodwill logo/branding.
- Deploy to free hosting.
- Configure iPad Guided Access.
