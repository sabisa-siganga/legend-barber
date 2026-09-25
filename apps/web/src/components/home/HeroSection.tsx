import heroImage from "../../assets/images/hero-barber-at-work.png";
import { shopDetails } from "../../lib/shopDetails";
import { SiteButton } from "../layout/SiteButton";

export function HeroSection() {
  return (
    <section className="bg-ink" aria-labelledby="hero-heading">
      <div className="relative lg:min-h-[max(40rem,calc(100svh-4.5rem))]">
        <img
          src={heroImage}
          alt="Barber finishing a haircut in the Crown and Blade shop"
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
          className="hero-media h-[70svh] w-full object-cover object-[72%_center] sm:h-[74svh] lg:absolute lg:inset-0 lg:h-full lg:object-[28%_center]"
        />
        <div className="relative z-10 lg:flex lg:min-h-[max(40rem,calc(100svh-4.5rem))] lg:items-stretch">
          <div className="flex w-full flex-col justify-end bg-ink px-5 py-10 sm:px-8 sm:py-12 lg:w-[42%] lg:justify-center lg:bg-transparent lg:py-16 lg:pr-12 lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]">
            <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
              <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
              {shopDetails.locationLabel}
            </p>
            <h1
              id="hero-heading"
              className="mt-5 font-display text-[clamp(2.75rem,5.4vw,4.6rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-bone"
            >
              Built for <span className="block">the detail.</span>
            </h1>
            <p className="mt-5 max-w-[22rem] text-base leading-relaxed text-bone sm:text-lg">
              Precision cuts. Clean finishes. No shortcuts.
            </p>
            <div className="mt-8">
              <SiteButton to="/services">Explore Services</SiteButton>
            </div>
            <p className="mt-12 border-t border-bone/20 pt-4 text-sm tracking-[0.06em] text-ash">
              {shopDetails.hoursCompact}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
