import { shopDetails } from "../../lib/shopDetails";
import { SiteButton } from "../layout/SiteButton";
import { SiteContainer } from "../layout/SiteContainer";

export function VisitSection() {
  return (
    <section className="bg-ink text-bone" aria-labelledby="visit-heading">
      <SiteContainer className="grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 bg-rust" aria-hidden="true" />
            FIND US
          </p>
          <h2
            id="visit-heading"
            className="mt-5 max-w-[12rem] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] sm:max-w-[16rem]"
          >
            Your chair in Gardens.
          </h2>
          <div className="mt-8">
            <SiteButton to="/services">View services and book</SiteButton>
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:border-l lg:border-bone/15 lg:pl-12">
          <address className="text-base leading-7 not-italic">
            <p>{shopDetails.addressLine1}</p>
            <p className="text-ash">{shopDetails.addressLine2}</p>
            <p className="mt-6">
              <a
                href={shopDetails.phoneHref}
                className="underline decoration-rust underline-offset-4 transition-colors duration-200 hover:decoration-bone motion-reduce:transition-none"
              >
                {shopDetails.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={shopDetails.emailHref}
                className="underline decoration-rust underline-offset-4 transition-colors duration-200 hover:decoration-bone motion-reduce:transition-none"
              >
                {shopDetails.email}
              </a>
            </p>
          </address>
          <div className="border-t border-bone/15 pt-6 text-base leading-7 sm:border-t-0 sm:border-l sm:border-bone/15 sm:pt-0 sm:pl-8">
            <p>{shopDetails.hoursWeekday}</p>
            <p className="text-ash">{shopDetails.hoursSunday}</p>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
