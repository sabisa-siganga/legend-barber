# Barber Shop Assessment: Feature Reference

**Version:** 4.6  
**Updated:** 24 September 2026  
**Purpose:** Record what we have actually agreed, one step at a time. This document is a scope reference, not an instruction to build everything at once.

## Product direction agreed

Build a coherent website for a fictional barber shop called **Legend Barber**, keeping the same brand throughout the site. Deliver all requirements in the assessment brief, but keep implementation simple and work through decisions in stages.

**Brand name:** Legend Barber

**Visual direction:** Modern urban, dark and bold. The logo, imagery, typography, colours and layout should feel contemporary, clean and confident, not like a traditional vintage barbershop.

**Design guardrails:** Avoid generic AI or template-like styling. Use strong editorial typography, intentionally composed layouts, real barbershop photography and a restrained palette. Do not rely on excessive gradients, glassmorphism, floating rounded cards, neon effects, stock dashboard patterns or decorative visuals that do not serve the content.

**Colour palette:** Near-black `#111111`, concrete grey `#5E5B56`, bone white `#F0EDE6`, and burnt rust `#B54832`. Burnt rust is reserved for high-value emphasis: primary actions, selected booking states, active navigation and small visual rules.

**Logo system:** Create a full Legend Barber logo lockup with a wordmark and a distinct **modern crown** symbol. Also create a standalone icon using that crown for smaller contexts such as the site favicon and compact header treatment. Keep the crown geometric and understated, avoiding ornate, royal or vintage styling. Do not use generic scissors, razor or moustache icons.

## Step 1: Pages agreed

| Page | Current decision |
|---|---|
| Home | Required. Introduces the shop. General booking calls to action take visitors to the Services page. |
| Services | Required. Displays services offered by the **shop/company**, with their prices, relevant descriptions and one purposeful image per service. Cards or another clear presentation are both acceptable; the precise layout comes later. Each service has its own booking action that opens the modal for that service. |
| About | A slightly richer page about Legend Barber's point of view, standards and craft in Sandton, Johannesburg. Use three purposeful images, a balanced story about craft and the local atmosphere, three standards and a “View Services” call to action. Do not introduce individual barber profiles. |
| Contact | A separate, minimal page showing the address **18 Rivonia Lane, Sandton, Johannesburg**, phone **+27 11 555 0188**, email **hello@legendbarber.co.za** and opening hours. Include a call to action that links to Services. Do not include a map, directions link, contact form or social links. Booking still opens only after the customer selects a service on the Services page. |
| Booking | The customer opens the booking modal from a specific service on the Services page. After a successful save, the same modal shows the confirmation in place of the form. No separate booking page is needed. |
| Terms & Conditions | A meaningful, accessible page covering the agreed booking, late-arrival, cancellation, pricing, customer-information and allergy policies. |
| Admin dashboard | A small, read-only view for the shop to see bookings for a selected date and the shop's opening and closing hours. One simple admin login gates this view. |

The chosen shop name, logo, colours and business details must be consistent across pages. Specific brand choices and page layouts are for a later discussion.

## Step 2: Services and booking details agreed

**The shop offers the service.** A customer does not choose a barber, and we do not assign a named barber in the customer flow. Any staff assignment is the company's own responsibility outside this website's booking form.

The customer journey agreed so far is:

1. Go to the Services page, select a service, and open its booking modal. The service is already known and cannot be changed inside the modal.
2. Select a date in the modal.
3. Select a time from a list of available slots returned by the backend for that booking selection.
4. Enter their name, email address and contact number.
5. Submit the booking details to our backend.
6. Once the backend confirms the booking was saved, replace the form inside the same modal with the confirmed service, date and time, plus calendar actions.

| Item | Current decision |
|---|---|
| Service listing | Services belong to the shop, not individual barbers. Show each service with its price, short description, service-specific image and booking action. Images must depict the relevant outcome or grooming context and follow the dark, modern urban visual direction. |
| Agreed services | **Signature Cut — R220**; **Skin Fade — R250**; **Cut + Beard Detail — R320**; **Beard Shape-Up — R150**; **Kids Cut — R160**; **Line-Up & Edge Detail — R120**. Every service uses one 30-minute booking slot. |
| General booking actions | A header Book Now action and any other general booking CTA navigate to the Services page; they do not open the modal. |
| Booking form | Display the already selected service in the modal without a service selector. Collect date, time, name, email and phone number. Pass the selected service along with these fields to the backend. Do not ask for a barber or extra customer information. |
| Opening schedule | Open Monday through Saturday, 08:00–17:00. Closed Sundays. Public holidays are open when they fall Monday through Saturday, on the same 08:00–17:00 schedule. |
| Available times | After choosing a date, the customer selects from available time slots supplied by the backend. The customer does not type in a time. The backend returns times within the shop's opening hours in 30-minute increments (for example, 10:00, 10:30, 11:00, 11:30) and excludes a slot already booked for that date. The final slot starts 30 minutes before closing, so a 17:00 closing time allows a 16:30 booking. |
| Same-day bookings | Customers may book an available slot later on the same day. Past times are unavailable. |
| Slot length | Every booking occupies exactly one 30-minute slot, regardless of the selected service. A booked slot blocks that date and start time for all services. |
| Repeat bookings | A customer may make multiple bookings, including different services on the same day, provided each chosen slot is available. There is no per-customer booking limit. |
| No double booking | Only one booking can take a given date and time slot. The backend must validate availability again when submitting, before saving. Concurrent requests must not both succeed for the same slot. |
| Taken slot response | If a selected slot is no longer available, do not save that booking. Return a clear error so the site can tell the customer: “That time was just booked. Please choose another available time.” Refresh the available times. |
| Backend | Return available time slots and receive and handle submitted booking information. Exact storage technology is still to be decided. |
| Email | Collect the customer's email as an agreed booking field, but do not send booking confirmation emails. No sending mailbox or email integration is part of this implementation. |
| Contact details for repeat bookings | After a successful booking, save only the customer's name, email and phone number in the browser's `sessionStorage`. Prefill those fields when they open the modal for another service in the same tab, while keeping every field editable. Do not carry over the previous service, date or time. A tab's session storage survives refreshes and is cleared when the tab's page session ends. This convenience does not replace the backend's saved booking records. |
| Booking modal | Open only when the customer chooses a specific service on the Services page. Display that service and its booking form. If the backend reports a validation or availability error, keep the form visible and show the error. Only after a successful save, hide the form and show success in the same modal. The modal remains closable. |
| Confirmation | Show the saved booking's service, date and time, then offer two actions: Add to Google Calendar and Add to Apple-compatible Calendar. The event ends 30 minutes after the selected start time and uses the confirmed booking information. |
| Calendar delivery | Google opens a prefilled event that the customer can save. The Apple-compatible action provides an `.ics` calendar file that the customer can add to Apple Calendar. These actions appear in the confirmation modal; no email is needed. |

The booking data passed to the backend should at least identify the selected service and appointment date/time and contain the name, email and phone number supplied by the customer. Backend IDs and timestamps can be added as implementation details without adding fields to the customer form.

## Step 3: Read-only admin dashboard agreed

| Item | Current decision |
|---|---|
| Bookings | The admin selects a date and sees the saved bookings for that day, including future dates, with time, service and customer contact details. |
| Date navigation | Let the admin change the selected date to inspect other days. There is no separate admin availability or open-slot view. |
| Shop hours | Display the agreed Monday–Saturday 08:00–17:00 schedule, Sunday closure and public-holiday rule. |
| Read-only | No editing bookings, changing hours, managing services, assigning barbers or other administration controls. |
| Access | One admin account with username `admin` and a private password configured on the server for the public deployment. The backend may compare the submitted password directly with that configured value; no password hashing, user database, registration or account management is required for this demo. Do not embed or publish the password in frontend code or the repository. The backend must check the admin session before returning bookings; hiding the dashboard in the frontend alone is insufficient. |

## Step 4: Homepage layout agreed

The homepage establishes the Legend Barber brand, previews services and leads customers to the Services page to select a service and open the booking modal. It does not open booking directly.

1. **Header:** Crown icon and Legend Barber wordmark; Home, Services, About and Contact navigation; a clearly visible **“Book Now”** action linking to Services. It does not open an empty booking modal, because a customer must select a service first.
2. **Hero:** One full-width, carefully cropped barbershop image with a dark overlay; headline **“Built for the detail.”**, supporting line **“Precision cuts. Clean finishes. No shortcuts.”**, and an “Explore Services” action.
3. **Brand statement:** **“Legend Barber is a space for sharp work, good energy and a look that holds up long after you leave.”** A brief, bold text section that adds personality and breaks up the imagery.
4. **Selected services:** Preview **Signature Cut**, **Skin Fade** and **Cut + Beard Detail** with their images, names and prices; a “View all services” link goes to Services. Booking actions live only on the Services page.
5. **Space / craft section:** One wide, purposeful image of the interior or barbering work with minimal supporting copy.
6. **Hours and location preview:** Monday–Saturday 08:00–17:00 and the shop address; an action links to Contact.
7. **Footer:** Navigation, contact details, opening hours, terms link, copyright and only social links that have real destinations.

**Homepage constraints:** No carousel, fake testimonials or dense card grid. The layout should feel editorial, confident and intentionally composed.

## Step 5: About page layout agreed

1. **Headline:** “Good work speaks for itself.”
2. **Supporting statement:** “Legend Barber is built around discipline, detail and a standard you can feel in every finish.”
3. **Story:** A balanced narrative about sharp craft and the energy of Sandton, Johannesburg.
4. **Imagery:** Three deliberate images: the shop space, barbering work and a finished cut. The images should read as one visual set, not unrelated stock images.
5. **Standards:** Detail over shortcuts; consistency in every chair; a space that respects your time.
6. **Location:** Explicitly mention Sandton, Johannesburg.
7. **Call to action:** “View Services”, linking to the Services page.

## Step 6: Terms & Conditions agreed

- Arriving more than **10 minutes late** may mean an appointment is shortened or needs to be rescheduled.
- Customers should cancel or reschedule at least **2 hours** before their appointment.
- Repeated no-shows may affect future booking availability.
- All displayed prices are in **South African Rand (ZAR)**. Prices may change, but the displayed price when the booking is made applies to that booking.
- A booking is confirmed when the website displays a successful booking confirmation. No confirmation email is sent.
- Legend Barber collects the customer's name, email and phone number only to manage bookings and does not sell or share those details for marketing.
- Customers must inform the team of relevant skin sensitivities or allergies before a service.
- Customers cancel or request changes by calling **+27 11 555 0188**.

## Step 7: Technical architecture agreed

- Build a **separate React frontend** and **Laravel backend API**.
- Frontend: **React**, **TypeScript**, **Vite**, **Tailwind CSS** and **React Router**.
- Connect the frontend and backend through REST endpoints.
- Use **MySQL** for persistent booking data.
- Use the browser `fetch` API for frontend requests; do not add a global state library or a heavy API-client layer.
- Use React component state for page and modal state, plus browser `sessionStorage` for the agreed same-tab contact prefilling.
- Use native date input and backend-provided time slots. Do not add a calendar UI library.
- Backend: **Laravel** REST API, Laravel migrations and Eloquent models with **MySQL**.
- Use **Laravel Sanctum** for a single simple admin session. The login endpoint checks username `admin` and the server-configured password, then protects dashboard and booking-list endpoints with the admin session.
- Calendar support: generate the Google Calendar URL and `.ics` file from saved booking data. No external calendar SDK or email service is required.
- Frontend tests: **Vitest** and **React Testing Library** for key UI and booking-flow behaviour.
- Backend tests: **Pest** feature tests for availability, duplicate-booking prevention, booking validation and admin access.
- Final acceptance testing: manual testing against the deployed frontend and API on desktop and mobile.
- Source control and CI: **GitHub** and a lightweight **GitHub Actions** workflow for frontend and backend tests.
- Hosting: **Vercel Hobby** for the React frontend; **Railway** for the Laravel API and MySQL service. Configure frontend API URL, backend CORS and server secrets as deployment environment variables. Railway's free tier is credit-limited, making it suitable for this assessment demo rather than permanent production hosting.

## Explicitly removed from the earlier draft

- Barber selection, barber-specific service cards, barber-specific availability and `barberId` in booking data.
- A global action that opens an empty booking modal, a service selector inside the modal and a separate booking page.
- Email confirmations and a sending mailbox are out of scope. The confirmation is shown in the booking modal.
- Any assumption that a particular storage service or booking page layout has already been approved.

## Assessment requirements to discuss in later steps

The brief also requires responsive design, functional navigation and footer, usable legal terms, testing and a publicly accessible live URL. We have **not yet settled their detailed design or implementation** in this step. The booking modal and both calendar actions are now part of the agreed flow.

**Deadline in the invitation:** Friday, 25 September 2026, 17:00 SAST. The assessment deliverable is one live website URL. The same reply must separately answer the invitation's three Yes/No questions.

## Next discussion point

Decide the About page's main headline and short supporting statement.
