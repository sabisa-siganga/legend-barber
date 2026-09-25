# Legend Barber Implementation Plan

> **For Cursor:** Build the React frontend and Laravel API task-by-task. Keep the project lean, test core rules first, and do not add features outside this document.

**Goal:** Build a polished, responsive Legend Barber website with a service-led booking flow, persistent time-slot validation, calendar actions and a read-only admin dashboard.

**Architecture:** Separate React SPA and Laravel REST API. The frontend owns the public pages, modal interaction and same-tab contact prefill. Laravel owns services, availability, bookings, calendar files and the single-admin session. MySQL persists bookings.

**Tech stack:** React, TypeScript, Vite, Tailwind CSS, React Router, browser `fetch`, Vitest, React Testing Library, Laravel, Laravel Sanctum, MySQL, Pest, GitHub Actions. Deployment is deliberately out of scope for this handoff.

**Source of truth:** `YES_Barber_Shop_Feature_Reference.md` and `Legend_Barber_Build_Checklist.md`.

---

## 1. Non-negotiable product rules

- Brand name: **Legend Barber**.
- Location: **18 Rivonia Lane, Sandton, Johannesburg**.
- Phone: **+27 11 555 0188**. Email: **hello@legendbarber.co.za**.
- Open Monday–Saturday, 08:00–17:00. Closed Sundays. Public holidays are open when they fall Monday–Saturday.
- Booking start times are every 30 minutes from 08:00 to 16:30. Every service occupies one 30-minute slot.
- A customer selects a service first on the Services page. Only then may a service-specific action open the booking modal.
- The modal does not contain service or barber selection. It collects date, backend-provided time, name, email and phone number.
- A saved booking blocks that exact date and start time for every service. The backend must re-check before saving; concurrent duplicate booking attempts must not both succeed.
- Customers may make multiple bookings if each selected slot is free, including more than one booking on one day.
- After successful booking, the same modal replaces the form with confirmation and calendar actions. Do not send booking emails.
- Save only name, email and phone number in browser `sessionStorage` after a success. Prefill those fields, still editable, when the customer books another service in the same tab. Do not prefill date, time or service.
- Admin is read-only. It selects a date and views that day's bookings and shop hours. It cannot edit bookings, hours or services.
- Do not add customer accounts, payments, a barber roster, service durations, newsletter logic, social feeds, maps, carousels, fake testimonials, gradients, glassmorphism, neon, or generic dashboard UI.

---

## 2. Brand system and visual assets

### Visual direction

Modern urban, dark and bold. The site should feel authored and editorial, not generated from a generic landing-page template.

| Token | Value | Use |
|---|---:|---|
| Ink | `#111111` | Primary background |
| Concrete | `#5E5B56` | Secondary copy, rules and muted areas |
| Bone | `#F0EDE6` | Primary text and light surfaces |
| Rust | `#B54832` | Primary actions, selected states, active nav and small rules only |

### Typography

- Display/headline font: **Archivo Narrow**, uppercase or title case, bold weights.
- Body/navigation font: **Archivo**, regular to semibold weights.
- Use tight, deliberate headline leading and normal body leading. Avoid oversized rounded type, gradient text and excessive all-caps paragraphs.

### Logo assets to create

Create these as SVGs, not raster images:

1. `legend-barber-lockup.svg`: geometric crown mark plus “LEGEND BARBER” wordmark.
2. `legend-barber-crown.svg`: standalone geometric, understated crown icon.
3. `favicon.svg`: simplified crown icon.

The crown must use clean geometric peaks and a stable base. It must not resemble a traditional ornate royal crown. Do not use scissors, razors or moustaches as a symbol.

### Photography / image asset inventory

Use real, high-quality photographs or carefully generated photorealistic editorial images. Keep the same colour temperature, contrast and urban barbershop mood. Avoid glossy AI faces, impossible tools/hands, text in images and over-smoothed interiors.

| Asset path | Intended subject | Alt text |
|---|---|---|
| `src/assets/images/hero-barber-shop.jpg` | Dark, modern Sandton barbershop interior with a single barber chair, mirrored station and textured concrete/wood finishes | `Interior of Legend Barber in Sandton` |
| `src/assets/images/service-signature-cut.jpg` | Close but natural editorial view of a precision scissor cut | `Precision signature haircut in progress` |
| `src/assets/images/service-skin-fade.jpg` | Clean side profile showing a finished skin fade | `Finished skin fade haircut` |
| `src/assets/images/service-cut-beard.jpg` | Groomed haircut and beard detail, calm side profile | `Cut and beard detail finish` |
| `src/assets/images/service-beard-shape.jpg` | Barber defining a beard edge with realistic tools and hand placement | `Beard shape-up service` |
| `src/assets/images/service-kids-cut.jpg` | Respectful, non-identifying child haircut scene, photographed from behind or side | `Kids haircut service` |
| `src/assets/images/service-line-up.jpg` | Detail of a crisp hairline finish | `Line-up and edge detail` |
| `src/assets/images/home-craft.jpg` | Wide barbershop work scene with real proportions and restrained lighting | `Barber at work at Legend Barber` |
| `src/assets/images/about-space.jpg` | Interior detail, chair and mirror composition | `Legend Barber workspace` |
| `src/assets/images/about-craft.jpg` | Natural close-up of precise barbering work | `Detail-focused barbering work` |
| `src/assets/images/about-finish.jpg` | Confident finished cut, editorial rather than posed stock portrait | `Finished cut at Legend Barber` |

Service images must map one-to-one to services. Do not reuse the same image for different service cards.

---

## 3. Content copy

### Global navigation

- Logo: home route `/`.
- Links: Home, Services, About, Contact.
- Header CTA: **Book Now**. It routes to `/services`; it never opens an empty modal.

### Homepage

1. Hero headline: **Built for the detail.**
2. Hero supporting line: **Precision cuts. Clean finishes. No shortcuts.**
3. Hero CTA: **Explore Services** → `/services`.
4. Brand statement: **Legend Barber is a space for sharp work, good energy and a look that holds up long after you leave.**
5. Homepage service preview: Signature Cut, Skin Fade, Cut + Beard Detail. Show their image, name and price only. CTA: **View all services** → `/services`.
6. Hours/location preview: Monday–Saturday 08:00–17:00; 18 Rivonia Lane, Sandton, Johannesburg. CTA goes to `/contact`.

### About page

- Headline: **Good work speaks for itself.**
- Supporting statement: **Legend Barber is built around discipline, detail and a standard you can feel in every finish.**
- Story: a concise balanced narrative about sharp craft and the energy of Sandton, Johannesburg.
- Standards:
  1. Detail over shortcuts
  2. Consistency in every chair
  3. A space that respects your time
- End CTA: **View Services** → `/services`.
- Use `about-space.jpg`, `about-craft.jpg` and `about-finish.jpg` in an intentionally asymmetrical editorial layout, not a three-card grid.

### Contact page

- Address: 18 Rivonia Lane, Sandton, Johannesburg.
- Phone: +27 11 555 0188, use a working `tel:` link.
- Email: hello@legendbarber.co.za, use a working `mailto:` link.
- Hours: Monday–Saturday 08:00–17:00; Sunday closed; public holidays open Monday–Saturday.
- CTA: **View Services** → `/services`.
- Do not add a map, directions button, contact form or social links.

### Services

| id | Name | Price | Image | Suggested description |
|---|---|---:|---|---|
| `signature-cut` | Signature Cut | R220 | `service-signature-cut.jpg` | A precise cut shaped for your everyday routine. |
| `skin-fade` | Skin Fade | R250 | `service-skin-fade.jpg` | Clean transitions, sharp finish and controlled detail. |
| `cut-beard-detail` | Cut + Beard Detail | R320 | `service-cut-beard.jpg` | A complete reset for your cut and beard line. |
| `beard-shape-up` | Beard Shape-Up | R150 | `service-beard-shape.jpg` | Defined edges and a cleaner beard profile. |
| `kids-cut` | Kids Cut | R160 | `service-kids-cut.jpg` | A comfortable, sharp cut for younger clients. |
| `line-up-edge-detail` | Line-Up & Edge Detail | R120 | `service-line-up.jpg` | Crisp lines for a clean in-between refresh. |

Every full service card has **Book this service**. Clicking it opens the booking modal with that exact service fixed.

### Terms & Conditions

Use clear headings for Booking Confirmation, Late Arrivals, Cancellations and Changes, No-Shows, Pricing, Customer Information, Skin Sensitivities and Allergies, and Contact.

- Booking is confirmed only after the site shows the success confirmation.
- More than 10 minutes late may shorten or reschedule an appointment.
- Cancel or request changes at least 2 hours before by calling +27 11 555 0188.
- Repeated no-shows may affect future booking availability.
- Prices are ZAR; the price shown at booking applies to that booking.
- Name, email and phone are collected only to manage bookings and are not sold or shared for marketing.
- Customers must disclose relevant skin sensitivities or allergies before service.

---

## 4. Frontend implementation map

Use this structure, adjusting only when a file needs a more focused responsibility:

```text
legend-barber-web/
  src/
    api/
      client.ts
      bookings.ts
      admin.ts
      services.ts
    assets/
      images/
      logo/
    components/
      layout/Header.tsx
      layout/Footer.tsx
      booking/BookingModal.tsx
      booking/BookingForm.tsx
      booking/BookingConfirmation.tsx
      services/ServiceCard.tsx
      admin/AdminDatePicker.tsx
      admin/BookingsTable.tsx
    hooks/
      useContactPrefill.ts
    lib/
      calendar.ts
      format.ts
    pages/
      HomePage.tsx
      ServicesPage.tsx
      AboutPage.tsx
      ContactPage.tsx
      TermsPage.tsx
      AdminLoginPage.tsx
      AdminDashboardPage.tsx
    types/
      api.ts
      booking.ts
      service.ts
    App.tsx
    main.tsx
    index.css
```

### Required frontend routes

| Route | Page |
|---|---|
| `/` | HomePage |
| `/services` | ServicesPage |
| `/about` | AboutPage |
| `/contact` | ContactPage |
| `/terms` | TermsPage |
| `/admin/login` | AdminLoginPage |
| `/admin` | AdminDashboardPage, protected by API session check |

### Booking modal states

- `form`: selected service fixed; select date; request available slots; select time; enter contact details.
- `submitting`: disable submit and prevent duplicate clicks.
- `error`: preserve all fields and show field or availability error.
- `success`: replace the form with saved service, date, time and two calendar buttons.

Implement Escape, backdrop click and a visible close button. Closing after success is allowed. Re-opening another service starts a new form while preloading only session-stored contact details.

### Frontend types

```ts
export type Service = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export type BookingInput = {
  serviceId: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm, Africa/Johannesburg
  customerName: string;
  email: string;
  phone: string;
};

export type BookingConfirmation = {
  reference: string;
  service: Pick<Service, 'id' | 'name' | 'price'>;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  googleCalendarUrl: string;
  appleCalendarUrl: string;
};
```

Use `sessionStorage` key `legend-barber-contact-prefill` with `{ customerName, email, phone }`. Guard parsing failures and clear invalid stored data.

---

## 5. Laravel API implementation map

```text
legend-barber-api/
  app/
    Http/Controllers/
      Api/ServiceController.php
      Api/AvailabilityController.php
      Api/BookingController.php
      Api/CalendarController.php
      Api/AdminAuthController.php
      Api/AdminBookingController.php
    Http/Requests/
      StoreBookingRequest.php
      AdminLoginRequest.php
    Models/
      Booking.php
      Service.php
    Services/
      AvailabilityService.php
      CalendarEventService.php
  database/
    migrations/
    seeders/ServiceSeeder.php
  routes/api.php
  tests/Feature/
```

### Database tables

#### `services`

| Column | Notes |
|---|---|
| `id` | string primary key, uses the service IDs above |
| `name` | required |
| `price_cents` | integer, e.g. `22000` for R220 |
| `description` | required |
| `is_active` | boolean, default true |
| timestamps | standard |

#### `bookings`

| Column | Notes |
|---|---|
| `id` | primary key |
| `reference` | UUID or non-guessable unique public reference |
| `service_id` | foreign key to `services` |
| `service_name` | snapshot at booking time |
| `price_cents` | snapshot at booking time |
| `booking_date` | date |
| `start_time` | time |
| `end_time` | time, always start + 30 minutes |
| `customer_name` | string |
| `email` | string |
| `phone` | string |
| timestamps | standard |

Add a database unique constraint on `(booking_date, start_time)`. This is essential: it is the final duplicate-booking defence under concurrent requests.

### API routes and contracts

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/services` | Return active services |
| `GET` | `/api/availability?date=YYYY-MM-DD` | Return available 30-minute slots for date |
| `POST` | `/api/bookings` | Validate and create booking |
| `GET` | `/api/bookings/{reference}/calendar.ics` | Download saved booking's Apple-compatible calendar event |
| `POST` | `/api/admin/login` | Log in the one admin account |
| `POST` | `/api/admin/logout` | End admin session |
| `GET` | `/api/admin/session` | Return current admin session state |
| `GET` | `/api/admin/bookings?date=YYYY-MM-DD` | Return one day's bookings; admin only |

#### `GET /api/availability`

Rules:

1. Reject invalid dates with `422`.
2. Return no slots on Sundays.
3. Return no slots for past dates.
4. For today, return only future start times.
5. Generate `08:00` through `16:30` inclusive at 30-minute intervals.
6. Remove any start time already present in `bookings` for that date.
7. Return `{ "date": "2026-09-25", "slots": ["10:30", "11:00"] }`.

#### `POST /api/bookings`

Request body equals `BookingInput` above. Validate:

- `serviceId`: exists and active.
- `date`: valid date, not past, not Sunday.
- `startTime`: exactly one valid 30-minute opening-hours slot.
- `customerName`: required, 2–100 characters.
- `email`: required valid email.
- `phone`: required, 7–30 characters after trimming.

Within a database transaction, ask `AvailabilityService` whether the exact date/time is still free, then insert. If the unique constraint fails or the slot is no longer free, return `409`:

```json
{
  "message": "That time was just booked. Please choose another available time.",
  "code": "slot_unavailable"
}
```

On success return `201` and `BookingConfirmation`. Build `endTime` as start plus 30 minutes in `Africa/Johannesburg`.

#### Calendar generation

- Google: build a prefilled event URL using saved booking data, title `Legend Barber — {service name}`, local date/time, location `18 Rivonia Lane, Sandton, Johannesburg`, and a short appointment description.
- Apple-compatible: `CalendarController` outputs a valid `text/calendar; charset=utf-8` `.ics` file. Use saved data, 30-minute start/end and timezone `Africa/Johannesburg`.
- Use the non-guessable booking `reference` in the `.ics` URL. Never use a sequential database ID as a public booking reference.

#### Admin authentication

- Username must be `admin`.
- Password comes from `ADMIN_PASSWORD` in the Laravel environment. It must never be committed or sent to the frontend.
- A direct string comparison is acceptable for this demo, per agreed scope.
- Use Sanctum to establish and validate the one admin session. Configure the React origin as a stateful SPA origin and make frontend API calls with credentials.
- Admin endpoints return `401` to unauthenticated callers. Do not rely on frontend route hiding alone.

---

## 6. Build sequence

### Task 1: Scaffold and shared configuration

- Create the separate frontend and Laravel API repositories/projects.
- Add `.env.example` files, never real secrets.
- Configure frontend variables: `VITE_API_URL`.
- Configure backend variables: MySQL connection, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, `ADMIN_PASSWORD`.
- Add service seed data and database migrations.
- Verify frontend can call `GET /api/services` locally.

### Task 2: Booking domain and API tests first

- Write Pest tests for valid availability, Sunday, past date, current-day past slot, booked slot and 16:30 final slot.
- Write a test that two requests for the same date/time result in one `201` and one `409`.
- Implement `AvailabilityService`, migrations, service seeder, `ServiceController`, `AvailabilityController` and `BookingController`.
- Run migrations and tests before moving to the UI.

### Task 3: Public site shell and pages

- Build the theme tokens, responsive header, footer and routes.
- Build Home, Services, About, Contact and Terms pages from the content above.
- Use the logo and image inventory; verify every declared action routes correctly.
- Add mobile menu behaviour and keyboard-visible focus states.

### Task 4: Booking modal

- Write frontend tests for opening from a service, preselected service display, contact validation and successful form-to-confirmation transition.
- Implement `BookingModal`, `BookingForm`, availability loading and `BookingConfirmation`.
- Use `fetch` wrappers that surface validation errors and `409 slot_unavailable` errors without erasing customer input.
- Implement the session-storage contact prefill hook and test invalid storage parsing.

### Task 5: Calendar actions

- Write backend tests verifying event start and end time for two distinct bookings.
- Implement Google URL builder and `.ics` response endpoint.
- Confirm the frontend confirmation renders both actions only after booking success.

### Task 6: Admin dashboard

- Write Pest tests for login failure, login success, unauthenticated dashboard access and date-filtered booking response.
- Implement Sanctum admin login/logout/session endpoints.
- Build minimal login and read-only dashboard UI.
- The dashboard must show selected date, bookings for that date and shop hours only.

### Task 7: Quality pass

- Test all declared desktop and mobile interactions.
- Test direct navigation to all routes.
- Verify no broken images, console errors, placeholder copy or debug output.
- Test the full path from homepage through calendar action against the local running stack.

---

## 7. Required tests and manual acceptance script

### Frontend automated tests

- A service's booking action opens a modal showing that service, with no service selector.
- Valid stored contact details prefill a new booking form; date, time and service do not.
- A `409 slot_unavailable` response leaves the form visible and shows the agreed human message.
- A successful save replaces the form with confirmation and two calendar actions.

### Laravel Pest feature tests

- Availability for an open weekday returns 08:00 through 16:30 when no bookings exist.
- Sunday and past dates return no bookable slots.
- A booking removes its exact time from availability for every service.
- Repeated customer details may create different free bookings.
- Duplicate time creation returns `409` and only one booking is stored.
- `.ics` content contains the saved service, selected date, start time, end time and address.
- Unauthenticated requests to `/api/admin/bookings` return `401`.
- Admin can read bookings for selected future date but cannot call edit/delete routes because none exist.

### Manual acceptance script

1. Open Home, use **Book Now**, then select a service on Services.
2. Open that service’s booking modal.
3. Select an open date and backend-provided time.
4. Submit valid customer details.
5. Confirm the modal changes to confirmation, with exact service/date/time.
6. Open the Google action and inspect correct event details.
7. Download/open the Apple-compatible `.ics` file and inspect correct details.
8. Attempt to book the same date/time again and confirm the friendly unavailable message.
9. Book another free time in the same tab and confirm contact details prefill but can be edited.
10. Log in as admin, select the booking date and confirm the booking appears.
11. Repeat key journey at mobile width.

---

## 8. Out of scope

- Deployment and live hosting configuration
- Payment collection
- Customer accounts or password reset
- Email confirmations or email delivery setup
- Barber selection or staff management
- Booking editing/cancellation in the dashboard
- Real social account setup
- Google Calendar API or access to a customer's calendar

## 9. Handoff prompt for Cursor

Paste this with the two companion documents attached:

> Build the Legend Barber project from the implementation plan. Create separate React and Laravel projects, do not implement deployment, and do not add features outside the agreed scope. Start with Laravel migrations, seed data and tested availability/booking endpoints, then build the React pages and service-specific booking modal. Preserve every product rule, copy string, asset mapping and API contract in the plan. Use focused components and tests for booking collision prevention, calendar event correctness and admin endpoint protection. Before calling the work complete, run the specified automated tests and the manual acceptance script.
