import { useEffect } from "react";
import finishImage from "../assets/images/about-the-finish.png";
import processImage from "../assets/images/about-the-process.png";
import spaceImage from "../assets/images/about-the-space.png";
import { SiteButton } from "../components/layout/SiteButton";
import { SiteContainer } from "../components/layout/SiteContainer";
import { shopDetails } from "../lib/shopDetails";

const standards = [
  {
    number: "01",
    title: "Detail over shortcuts",
    detail: "Every line, fade and finish is handled with purpose.",
  },
  {
    number: "02",
    title: "Consistency in every chair",
    detail: "The standard stays high, no matter which service you choose.",
  },
  {
    number: "03",
    title: "A space that respects your time",
    detail: "A calm, focused experience from the moment you arrive.",
  },
] as const;

export function AboutPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `About | ${shopDetails.name}`;

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <section className="bg-ink text-bone" aria-labelledby="about-heading">
        <div className="lg:grid lg:min-h-[max(40rem,calc(100svh-4.5rem))] lg:grid-cols-12">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:col-span-5 lg:py-24 lg:pr-12 lg:pl-[max(3rem,calc((100%-90rem)/2+3rem))]">
            <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
              <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
              OUR STANDARD
            </p>
            <h1
              id="about-heading"
              className="mt-5 max-w-[11ch] font-display text-[clamp(2.75rem,5.4vw,4.6rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance"
            >
              Good work speaks for itself.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-ash sm:text-lg sm:leading-8">
              Crown & Blade is built around discipline, detail and a standard
              you can feel in every finish.
            </p>
          </div>
          <div className="lg:col-span-7">
            <img
              src={spaceImage}
              alt="Crown and Blade shop interior with barber chairs, mirrors and daylight over Cape Town"
              width={1536}
              height={1024}
              fetchPriority="high"
              decoding="async"
              className="h-[62svh] w-full object-cover object-[58%_center] sm:h-[68svh] lg:h-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-bone text-ink" aria-labelledby="about-story-heading">
        <div className="grid lg:grid-cols-12 lg:items-stretch">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <img
              src={processImage}
              alt="Barber cutting hair with scissors and a comb at Crown and Blade"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full object-cover object-[center_42%] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
            />
          </div>
          <div className="order-1 flex items-center lg:order-2 lg:col-span-5">
            <div className="w-full px-5 py-16 sm:px-8 sm:py-20 lg:border-l lg:border-rust lg:py-24 lg:pr-[max(3rem,calc((100%-90rem)/2+3rem))] lg:pl-12">
              <p className="text-[0.68rem] font-medium tracking-[0.22em] text-concrete">
                THE SHOP
              </p>
              <h2
                id="about-story-heading"
                className="mt-5 max-w-[20rem] font-display text-[clamp(1.7rem,2.7vw,2.45rem)] leading-[1.18] font-semibold tracking-[-0.03em] text-balance"
              >
                Crown & Blade is a space for people who value the details. We
                focus on precise work, consistent finishes and an experience
                that respects your time.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-concrete">
                Based in Gardens, Cape Town, the shop brings together sharp
                craft, calm confidence and a modern approach to grooming. No
                shortcuts, no unnecessary noise, just work that looks right from
                every angle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-bone/15 bg-ink text-bone"
        aria-labelledby="standards-heading"
      >
        <SiteContainer className="py-20 sm:py-24 lg:py-28">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            THREE STANDARDS
          </p>
          <h2
            id="standards-heading"
            className="mt-5 max-w-[12ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance"
          >
            Three standards.
          </h2>
          <ol className="mt-14 border-t border-bone/15 lg:mt-20">
            {standards.map((standard) => (
              <li
                key={standard.number}
                className="grid gap-4 border-b border-bone/15 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8 sm:py-10"
              >
                <p className="text-xs tracking-[0.18em] text-ash sm:col-span-2">
                  {standard.number}
                </p>
                <h3 className="font-display text-[clamp(1.5rem,2vw,1.85rem)] leading-none font-semibold tracking-[-0.03em] sm:col-span-5">
                  {standard.title}
                </h3>
                <p className="max-w-md text-base leading-7 text-ash sm:col-span-5">
                  {standard.detail}
                </p>
              </li>
            ))}
          </ol>
        </SiteContainer>
      </section>

      <section className="bg-bone text-ink" aria-labelledby="about-finish-heading">
        <div className="grid lg:grid-cols-12 lg:items-center">
          <div className="order-2 px-5 py-14 sm:px-8 sm:py-16 lg:order-1 lg:col-span-4 lg:col-start-1 lg:py-24 lg:pr-10 lg:pl-[max(3rem,calc((100%-90rem)/2+3rem))]">
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-concrete">
              THE FINISH
            </p>
            <h2
              id="about-finish-heading"
              className="mt-5 max-w-[10ch] font-display text-[clamp(2rem,3.4vw,3.15rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance"
            >
              From every angle.
            </h2>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6 lg:py-16">
            <img
              src={finishImage}
              alt="Client in the chair with a finished cut and beard at Crown and Blade"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-[center_28%] sm:aspect-[3/2] lg:aspect-[5/4] lg:max-h-[40rem]"
            />
          </div>
        </div>
      </section>

      <section
        className="border-t border-bone/15 bg-ink text-bone"
        aria-labelledby="about-visit-heading"
      >
        <SiteContainer className="py-20 sm:py-24 lg:py-28">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            {shopDetails.locationLabel}
          </p>
          <h2
            id="about-visit-heading"
            className="mt-5 max-w-[16ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance"
          >
            Built for the detail, in the heart of Cape Town.
          </h2>
          <p className="mt-8 text-base text-bone">
            {shopDetails.addressLine1}, {shopDetails.addressLine2}
          </p>
          <div className="mt-8">
            <SiteButton to="/services">View Services</SiteButton>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}
