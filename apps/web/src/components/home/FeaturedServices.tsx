import { Link } from "react-router";
import cutAndBeardImage from "../../assets/images/service-cut-beard-detail.png";
import signatureCutImage from "../../assets/images/service-signature-cut.png";
import skinFadeImage from "../../assets/images/service-skin-fade.png";
import { SiteContainer } from "../layout/SiteContainer";
import { TextAction } from "../layout/TextAction";

const featuredServices = [
  {
    name: "Signature Cut",
    description: "A considered cut, shaped around you.",
    meta: "R220 · 30 min",
    image: signatureCutImage,
    alt: "Barber cutting hair with scissors for a signature cut",
  },
  {
    name: "Skin Fade",
    description: "Clean blend. Sharp finish.",
    meta: "R250 · 30 min",
    image: skinFadeImage,
    alt: "Barber blending a skin fade with clippers",
  },
  {
    name: "Cut + Beard Detail",
    description: "A complete reset, from crown to jawline.",
    meta: "R320 · 30 min",
    image: cutAndBeardImage,
    alt: "Barber detailing a beard along the jawline",
  },
] as const;

export function FeaturedServices() {
  return (
    <section
      className="bg-ink text-bone"
      aria-labelledby="featured-services-heading"
    >
      <SiteContainer className="py-20 sm:py-24 lg:py-28">
        <h2
          id="featured-services-heading"
          className="max-w-[16rem] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] sm:max-w-[20rem] lg:max-w-none"
        >
          The work, done properly.
        </h2>
        <ul className="mt-12 grid grid-cols-1 gap-y-14 md:mt-16 lg:grid-cols-3 lg:items-start lg:gap-x-8">
          {featuredServices.map((service, index) => (
            <li
              key={service.name}
              className={index === 1 ? "lg:mt-16" : undefined}
            >
              <Link
                to="/services"
                className="group grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-end md:gap-8 lg:grid-cols-1 lg:items-start lg:gap-0"
              >
                <div className="overflow-hidden border-t border-bone/20">
                  <img
                    src={service.image}
                    alt={service.alt}
                    width={1122}
                    height={1402}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="border-b border-bone/15 pb-5 lg:mt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.65rem] leading-none font-semibold tracking-[-0.03em] underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-200 group-hover:decoration-rust motion-reduce:transition-none">
                      {service.name}
                    </h3>
                    <span className="text-xs tracking-[0.16em] text-ash">
                      {`0${index + 1}`}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[28ch] text-sm leading-6 text-ash">
                    {service.description}
                  </p>
                  <p className="mt-3 text-sm tracking-[0.04em] text-bone">
                    {service.meta}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 md:mt-16">
          <TextAction to="/services">View all services →</TextAction>
        </div>
      </SiteContainer>
    </section>
  );
}
