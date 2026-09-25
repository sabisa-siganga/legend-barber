import { Link } from "react-router";
import { shopDetails } from "../../lib/shopDetails";
import { BrandLogo } from "./BrandLogo";
import { PrimaryNav } from "./PrimaryNav";
import { SiteContainer } from "./SiteContainer";
import { termsLink } from "./siteNavigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-bone/15 bg-ink">
      <SiteContainer className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <BrandLogo />
        </div>
        <nav aria-label="Footer" className="lg:col-span-3">
          <PrimaryNav className="flex flex-col gap-3" />
          <ul className="mt-3 flex flex-col gap-3">
            <li>
              <Link
                to="/services"
                className="inline-flex text-sm tracking-[0.06em] text-ash underline decoration-transparent decoration-1 underline-offset-[7px] transition-colors duration-200 hover:text-bone hover:decoration-bone motion-reduce:transition-none"
              >
                Book Now
              </Link>
            </li>
            <li>
              <Link
                to={termsLink.to}
                className="inline-flex text-sm tracking-[0.06em] text-ash underline decoration-transparent decoration-1 underline-offset-[7px] transition-colors duration-200 hover:text-bone hover:decoration-bone motion-reduce:transition-none"
              >
                {termsLink.label}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5">
          <address className="text-sm leading-7 text-ash not-italic">
            <p className="text-bone">{shopDetails.addressLine1}</p>
            <p>{shopDetails.addressLine2}</p>
            <p className="mt-4">
              <a
                href={shopDetails.phoneHref}
                className="text-bone underline decoration-rust underline-offset-4 transition-colors duration-200 hover:decoration-bone motion-reduce:transition-none"
              >
                {shopDetails.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={shopDetails.emailHref}
                className="text-bone underline decoration-rust underline-offset-4 transition-colors duration-200 hover:decoration-bone motion-reduce:transition-none"
              >
                {shopDetails.email}
              </a>
            </p>
          </address>
          <div className="text-sm leading-7 text-ash">
            <p>{shopDetails.hoursWeekday}</p>
            <p>{shopDetails.hoursSunday}</p>
          </div>
        </div>
      </SiteContainer>
      <div className="border-t border-bone/15">
        <SiteContainer className="py-5">
          <p className="text-sm text-ash">{shopDetails.copyright}</p>
        </SiteContainer>
      </div>
    </footer>
  );
}
