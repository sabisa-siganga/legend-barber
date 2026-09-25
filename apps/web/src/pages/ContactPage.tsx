import { useEffect } from "react";
import shopImage from "../assets/images/about-the-space.png";
import { SiteButton } from "../components/layout/SiteButton";
import { SiteContainer } from "../components/layout/SiteContainer";
import { shopDetails } from "../lib/shopDetails";

const openingHours = [
  "Monday–Saturday: 08:00–17:00",
  "Sunday: Closed",
  "Public holidays: Open Monday–Saturday, 08:00–17:00",
] as const;

const detailLabelClassName =
  "text-[0.68rem] font-medium tracking-[0.22em] text-ash";

const detailRuleClassName =
  "border-t border-bone/15 py-8 first:border-t-0 first:pt-0 last:pb-0";

const contactLinkClassName =
  "inline-flex min-h-11 items-center break-words text-lg leading-7 underline decoration-rust underline-offset-4 transition-colors duration-200 hover:decoration-bone motion-reduce:transition-none sm:text-xl";

export function ContactPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Contact | ${shopDetails.name}`;

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <section className="bg-ink text-bone" aria-labelledby="contact-heading">
        <SiteContainer className="py-20 sm:py-24 lg:pt-28 lg:pb-16">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            CONTACT
          </p>
          <h1
            id="contact-heading"
            className="mt-5 max-w-[14ch] font-display text-[clamp(2.75rem,5.4vw,4.6rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance"
          >
            Find your next clean finish.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ash sm:text-lg sm:leading-8">
            Visit Crown & Blade in Gardens, Cape Town, or get in touch before
            your next appointment.
          </p>
        </SiteContainer>
      </section>
      <section
        className="border-t border-bone/15 bg-ink text-bone"
        aria-labelledby="contact-details-heading"
      >
        <h2 id="contact-details-heading" className="sr-only">
          Contact details
        </h2>
        <SiteContainer className="grid items-start gap-14 py-16 sm:gap-16 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <dl className="order-1 min-w-0 lg:order-2">
            <div className={detailRuleClassName}>
              <dt className={detailLabelClassName}>Visit</dt>
              <dd className="mt-3">
                <address className="text-lg leading-8 not-italic sm:text-xl">
                  <p>{shopDetails.addressLine1}</p>
                  <p className="text-ash">{shopDetails.addressLine2}</p>
                </address>
              </dd>
            </div>
            <div className={detailRuleClassName}>
              <dt className={detailLabelClassName}>Call</dt>
              <dd className="mt-3">
                <a href={shopDetails.phoneHref} className={contactLinkClassName}>
                  {shopDetails.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className={detailRuleClassName}>
              <dt className={detailLabelClassName}>Email</dt>
              <dd className="mt-3">
                <a
                  href={shopDetails.emailHref}
                  className={contactLinkClassName}
                >
                  {shopDetails.email}
                </a>
              </dd>
            </div>
            <div className={detailRuleClassName}>
              <dt className={detailLabelClassName}>Opening hours</dt>
              <dd className="mt-3">
                <ul className="text-lg leading-8 sm:text-xl">
                  {openingHours.map((hoursLine) => (
                    <li key={hoursLine}>{hoursLine}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <img
            src={shopImage}
            alt="Barber chairs and mirrors inside the Crown and Blade shop"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="order-2 block aspect-[3/2] w-full min-w-0 object-cover lg:order-1"
          />
        </SiteContainer>
      </section>
      <section
        className="border-t border-bone/15 bg-ink text-bone"
        aria-labelledby="contact-cta-heading"
      >
        <SiteContainer className="py-20 sm:py-24 lg:py-28">
          <h2
            id="contact-cta-heading"
            className="max-w-[16ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance"
          >
            Ready when you are.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ash">
            Choose your service first, then select a time that works for you.
          </p>
          <div className="mt-8">
            <SiteButton to="/services">View Services</SiteButton>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}
