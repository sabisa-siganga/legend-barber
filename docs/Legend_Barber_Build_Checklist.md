# Crown & Blade: Build Checklist

Use this checklist alongside the feature reference. Check items only after they are built and tested in the deployed app.

## 1. Project foundation

- [ ] Create the React + TypeScript + Vite + Tailwind CSS + React Router frontend.
- [ ] Create the Laravel REST API with MySQL, migrations and Eloquent models.
- [ ] Configure Laravel Sanctum for the one simple admin session.
- [ ] Configure environment variables for the database and admin password.
- [ ] Set up persistent database storage for bookings.
- [ ] Add a clear local and production configuration.
- [ ] Configure CORS for the separate React frontend.
- [ ] Set up GitHub repositories and a lightweight GitHub Actions test workflow.
- [ ] Define the six services as shared application data.
- [ ] Add opening schedule rules: Monday–Saturday, 08:00–17:00; Sundays closed; public holidays open when they fall Monday–Saturday.

## 2. Brand and assets

- [ ] Create the Crown & Blade wordmark.
- [ ] Create the geometric modern-crown symbol.
- [ ] Create a compact crown icon and favicon.
- [ ] Apply the agreed palette: near-black, concrete grey, bone white and burnt rust.
- [ ] Select readable, editorial typography with clear hierarchy.
- [ ] Source or create a cohesive image set for the hero, About page and each service.
- [ ] Check all images are high quality, correctly cropped, appropriately licensed and have meaningful alt text.

## 3. Shared website structure

- [ ] Build the header with logo, Home, Services, About and Contact links.
- [ ] Add a visible **Book Now** header action that routes to Services.
- [ ] Build a working mobile navigation menu.
- [ ] Build the footer with navigation, contact details, hours, booking link, Terms & Conditions and copyright.
- [ ] Resolve the footer social-link requirement without adding a fake or broken account link.
- [ ] Add page titles and descriptions.

## 4. Homepage

- [ ] Add the full-width hero image with dark overlay.
- [ ] Add headline: **Built for the detail.**
- [ ] Add supporting line: **Precision cuts. Clean finishes. No shortcuts.**
- [ ] Add an Explore Services action that routes to Services.
- [ ] Add the approved brand statement.
- [ ] Preview Signature Cut, Skin Fade and Cut + Beard Detail with images, names and prices.
- [ ] Add a View all services action.
- [ ] Add the wide space/craft image section.
- [ ] Add the Sandton location and Monday–Saturday 08:00–17:00 preview.
- [ ] Add a Contact action.
- [ ] Confirm no carousel, fake testimonials or dense generic card grid.

## 5. Services page

- [ ] Show all six agreed services:
  - [ ] Signature Cut — R220
  - [ ] Skin Fade — R250
  - [ ] Cut + Beard Detail — R320
  - [ ] Beard Shape-Up — R150
  - [ ] Kids Cut — R160
  - [ ] Line-Up & Edge Detail — R120
- [ ] Give every service a short description and service-specific image.
- [ ] Give every service its own booking action.
- [ ] Confirm every booking action opens the modal with that service already selected.
- [ ] Confirm there is no barber selector or service selector inside the modal.

## 6. Booking backend and availability

- [ ] Create a booking record with service, date, time, name, email, phone number and server-generated fields.
- [ ] Return available slots for the requested date from the backend.
- [ ] Generate 30-minute slots from 08:00 through 16:30 on open days.
- [ ] Exclude Sundays, past dates and past times on the current day.
- [ ] Exclude already booked slots.
- [ ] Allow customers to book multiple non-conflicting slots, including on the same day.
- [ ] Re-check availability on the backend immediately before saving.
- [ ] Prevent concurrent bookings from saving the same date and time slot.
- [ ] Return a user-friendly unavailable-slot error and refresh available times.

## 7. Booking modal and confirmation

- [ ] Open the booking form in a closable modal from a selected service.
- [ ] Show the selected service as fixed information.
- [ ] Provide date selection for valid open days.
- [ ] Load the time list from the backend after date selection.
- [ ] Collect and validate name, email and phone number.
- [ ] Show clear field errors, request failure feedback and submitting state.
- [ ] Keep the form visible if saving fails.
- [ ] On success, replace the form in the same modal with booking confirmation.
- [ ] Show the confirmed service, date and time.
- [ ] Store name, email and phone number in `sessionStorage` after success.
- [ ] Prefill those three fields, still editable, for another booking in the same tab.
- [ ] Do not store service, date or time for the next booking.
- [ ] Do not send confirmation emails.

## 8. Calendar actions

- [ ] Add an **Add to Google Calendar** action to the confirmation.
- [ ] Generate the Google Calendar event from the saved booking data.
- [ ] Add an **Add to Apple-compatible Calendar** action.
- [ ] Generate a downloadable `.ics` event from the saved booking data.
- [ ] Include Crown & Blade, the selected service, 30-minute start/end times and Sandton location in both events.
- [ ] Test two different bookings to confirm the calendar details are not hard-coded.

## 9. Other pages

- [ ] Build the About page with headline: **Good work speaks for itself.**
- [ ] Add the approved About supporting statement and Sandton craft story.
- [ ] Add three cohesive images: space, barbering work and finished cut.
- [ ] Add the three standards: detail over shortcuts; consistency in every chair; a space that respects your time.
- [ ] Add a View Services action.
- [ ] Build the Contact page with address, phone, email and opening hours.
- [ ] Add the Contact page call to action to Services.
- [ ] Build meaningful Terms & Conditions using all agreed policies.

## 10. Read-only admin dashboard

- [ ] Build a simple admin login page for username `admin` and a private server-configured password.
- [ ] Create an admin session and protect both the dashboard page and bookings endpoint.
- [ ] Add logout behaviour.
- [ ] Let the admin choose a date, including future dates.
- [ ] Show that day's saved bookings: time, service, customer name, email and phone number.
- [ ] Show the shop opening hours.
- [ ] Confirm the dashboard has no edit, delete, service management or hours-management controls.

## 11. Responsiveness, accessibility and quality

- [ ] Test desktop, tablet and mobile layouts.
- [ ] Check no horizontal overflow occurs.
- [ ] Check images resize and crop correctly.
- [ ] Check keyboard navigation, visible focus, modal close control and labelled form fields.
- [ ] Check contrast for text, buttons and errors.
- [ ] Check all navigation, calls to action, legal links, calendar actions and contact links work.
- [ ] Check no console errors, broken images, debug copy or unfinished sections remain.
- [ ] Add Vitest + React Testing Library tests for key frontend behaviour.
- [ ] Add Pest feature tests for booking availability, duplicate prevention, validation and admin access.

## 12. Final verification and submission

- [ ] Test: Home → Services → service booking action → date → available time → customer details → save booking → calendar action.
- [ ] Test a taken slot and confirm the user sees the correct error.
- [ ] Test a same-day future booking.
- [ ] Test a second booking in the same tab and confirm contact details prefill.
- [ ] Test admin login and date-filtered booking list.
- [ ] Test Google Calendar event details and Apple-compatible `.ics` file.
- [ ] Deploy the site and backend publicly.
- [ ] Deploy the React frontend to Vercel Hobby.
- [ ] Deploy the Laravel API and MySQL database to Railway.
- [ ] Verify every route works directly on the live deployment.
- [ ] Submit one live website URL before the assessment deadline.
