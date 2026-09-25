import { useEffect, type ReactNode } from "react";
import { Link } from "react-router";
import { SiteButton } from "../components/layout/SiteButton";
import { SiteContainer } from "../components/layout/SiteContainer";
import { shopDetails } from "../lib/shopDetails";

const termsDocumentTitle = "Terms & Conditions | Crown & Blade";
const termsMetaDescription =
  "Read Crown & Blade booking, cancellation, pricing and customer information terms.";
const termsUpdatedOn = "2026-09-25";
const termsUpdatedLabel = "25 September 2026";

const proseLinkClassName =
  "underline decoration-rust underline-offset-4 transition-colors duration-200 hover:decoration-bone motion-reduce:transition-none";

type TermsSection = {
  id: string;
  number: string;
  title: string;
  body: ReactNode;
};

const termsSections: readonly TermsSection[] = [
  {
    id: "booking-services",
    number: "01",
    title: "Booking services",
    body: (
      <>
        <p>
          Customers begin a booking by selecting a specific service from the{" "}
          <Link to="/services" className={proseLinkClassName}>
            Services page
          </Link>
          . The selected service remains fixed in the booking modal.
        </p>
        <p>
          Each appointment is booked as one 30-minute time slot. Crown & Blade
          does not offer barber selection through the website.
        </p>
      </>
    ),
  },
  {
    id: "booking-confirmation",
    number: "02",
    title: "Booking confirmation",
    body: (
      <>
        <p>
          A booking is confirmed only once the website successfully saves it
          and displays the booking confirmation in the modal.
        </p>
        <p>
          Crown & Blade does not send booking confirmation emails. Keep the
          on-screen confirmation. Where available, you can add the appointment
          to Google Calendar or an Apple-compatible calendar.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    number: "03",
    title: "Availability and booking times",
    body: (
      <>
        <p>
          Appointments are subject to real-time availability. A time slot is
          not reserved until the booking is successfully confirmed.
        </p>
        <p>
          If another customer books a selected time before the booking is
          submitted, choose another available time.
        </p>
        <p>
          Same-day bookings may be made where a future time slot is still
          available.
        </p>
      </>
    ),
  },
  {
    id: "late-arrivals",
    number: "04",
    title: "Late arrivals",
    body: (
      <>
        <p>Please arrive on time for your appointment.</p>
        <p>
          If you arrive more than{" "}
          <strong className="font-semibold">10 minutes late</strong>, Crown &
          Blade may need to shorten the service or reschedule the appointment,
          depending on the remaining availability.
        </p>
      </>
    ),
  },
  {
    id: "cancellations",
    number: "05",
    title: "Cancellations and changes",
    body: (
      <>
        <p>
          Please cancel or request changes at least{" "}
          <strong className="font-semibold">2 hours before</strong>{" "}
          your appointment.
        </p>
        <p>
          The current booking flow does not include online cancellation or
          rescheduling. Contact Crown & Blade directly on{" "}
          <a href={shopDetails.phoneHref} className={proseLinkClassName}>
            {shopDetails.phoneDisplay}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "no-shows",
    number: "06",
    title: "No-shows",
    body: (
      <>
        <p>
          If you do not arrive for a confirmed appointment and do not contact
          Crown & Blade in advance, the appointment is treated as a no-show.
        </p>
        <p>
          Repeated no-shows may affect your ability to make future bookings.
        </p>
      </>
    ),
  },
  {
    id: "prices",
    number: "07",
    title: "Prices",
    body: (
      <>
        <p>
          All displayed prices are in{" "}
          <strong className="font-semibold">South African Rand (ZAR)</strong>.
        </p>
        <p>
          Prices may change from time to time. The price displayed for a
          service when a booking is successfully made applies to that confirmed
          booking.
        </p>
        <p>
          No online payment, deposits, customer accounts or payment processing
          are included in the current website booking flow.
        </p>
      </>
    ),
  },
  {
    id: "customer-information",
    number: "08",
    title: "Customer information",
    body: (
      <>
        <p>
          Crown & Blade collects a customer’s name, email address and contact
          number only to manage and administer bookings.
        </p>
        <p>This information is not sold or shared for marketing purposes.</p>
        <p>
          For convenience during the same browser session, contact details may
          be saved in browser session storage to prefill another booking form.
          You can edit these fields before submitting another booking.
        </p>
      </>
    ),
  },
  {
    id: "skin-sensitivities",
    number: "09",
    title: "Skin sensitivities and allergies",
    body: (
      <>
        <p>
          Please tell the Crown & Blade team about any relevant skin
          sensitivities, allergies or conditions before a service begins.
        </p>
        <p>
          This helps the team provide the service with appropriate care. Do not
          proceed with a service if you are unsure whether a product or
          treatment may cause a reaction.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to these terms",
    body: (
      <p>
        Crown & Blade may update these Terms & Conditions when its booking
        process, services or operating practices change. The latest version
        will be published on this page.
      </p>
    ),
  },
  {
    id: "contact",
    number: "11",
    title: "Contact",
    body: (
      <>
        <p>
          For booking changes or questions about these terms, contact Crown &
          Blade using the phone number and email address shown on the{" "}
          <Link to="/contact" className={proseLinkClassName}>
            Contact page
          </Link>
          .
        </p>
        <p>
          <a href={shopDetails.phoneHref} className={proseLinkClassName}>
            {shopDetails.phoneDisplay}
          </a>
        </p>
        <p>
          <a href={shopDetails.emailHref} className={proseLinkClassName}>
            {shopDetails.email}
          </a>
        </p>
        <address className="not-italic">
          <p>Crown & Blade</p>
          <p>{shopDetails.addressLine1}</p>
          <p>{shopDetails.addressLine2}</p>
        </address>
      </>
    ),
  },
];

const useTermsDocumentMetadata = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = termsDocumentTitle;

    const existingMeta = document.head.querySelector(
      'meta[name="description"]',
    );
    const createdMeta = existingMeta === null;
    const meta = existingMeta ?? document.createElement("meta");
    const previousDescription = existingMeta?.getAttribute("content") ?? null;

    if (createdMeta) {
      meta.setAttribute("name", "description");
      document.head.append(meta);
    }

    meta.setAttribute("content", termsMetaDescription);

    return () => {
      document.title = previousTitle;

      if (createdMeta) {
        meta.remove();
        return;
      }

      if (previousDescription === null) {
        meta.removeAttribute("content");
        return;
      }

      meta.setAttribute("content", previousDescription);
    };
  }, []);
};

export function TermsPage() {
  useTermsDocumentMetadata();

  return (
    <article className="bg-ink text-bone">
      <SiteContainer className="py-16 sm:py-20 lg:pt-24 lg:pb-28">
        <header className="max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash"
          >
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            <ol className="flex flex-wrap items-center">
              <li>
                <Link
                  to="/"
                  className="transition-colors duration-200 hover:text-bone motion-reduce:transition-none"
                >
                  Crown & Blade
                </Link>
              </li>
              <li aria-hidden="true">{" / "}</li>
              <li>Legal</li>
            </ol>
          </nav>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,8vw,4.6rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance">
            Terms & Conditions
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ash sm:text-lg sm:leading-8">
            These terms explain how bookings at Crown & Blade work and what you
            can expect when you visit us.
          </p>
          <p className="mt-6 text-sm text-ash">
            Last updated{" "}
            <time dateTime={termsUpdatedOn}>{termsUpdatedLabel}</time>
          </p>
        </header>

        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16">
          <nav
            aria-label="Terms sections"
            className="min-w-0 border-y border-bone/15 py-6 lg:sticky lg:top-8 lg:col-span-4 lg:self-start lg:border-y-0 lg:py-0"
          >
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-ash">
              ON THIS PAGE
            </p>
            <ol className="mt-4 flex flex-col">
              {termsSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex gap-4 py-2 text-sm leading-6 text-ash underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-200 hover:text-bone hover:decoration-bone motion-reduce:transition-none"
                  >
                    <span className="w-7 shrink-0 tracking-[0.14em] text-ash">
                      {section.number}
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-14 min-w-0 max-w-[40rem] space-y-0 lg:col-span-7 lg:col-start-6 lg:mt-0">
            {termsSections.map((section) => {
              const headingId = `${section.id}-heading`;

              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={headingId}
                  className="scroll-mt-8 border-t border-bone/15 py-10 first:border-t-0 first:pt-0 sm:py-12"
                >
                  <p className="text-xs tracking-[0.18em] text-ash">
                    {section.number}
                  </p>
                  <h2
                    id={headingId}
                    className="mt-3 font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-none font-semibold tracking-[-0.03em]"
                  >
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-8">
                    {section.body}
                  </div>
                </section>
              );
            })}

            <div className="border-t border-bone/15 pt-10 sm:pt-12">
              <SiteButton to="/services">Back to Services</SiteButton>
            </div>
          </div>
        </div>
      </SiteContainer>
    </article>
  );
}
