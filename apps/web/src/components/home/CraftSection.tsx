import craftImage from "../../assets/images/home-craft-tools.png";
import { TextAction } from "../layout/TextAction";

export function CraftSection() {
  return (
    <section className="bg-bone text-ink" aria-labelledby="craft-heading">
      <div className="grid lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7">
          <img
            src={craftImage}
            alt="Clippers, scissors and combs laid out beside the barber chair"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="block aspect-[3/2] w-full object-cover object-[30%_center] lg:aspect-auto lg:h-[40rem]"
          />
        </div>
        <div className="flex items-center lg:col-span-5">
          <div className="w-full px-5 py-16 sm:px-8 sm:py-20 lg:py-24 lg:pr-[max(3rem,calc((100%-90rem)/2+3rem))] lg:pl-12 xl:pl-16">
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-concrete">
              NO SHORTCUTS
            </p>
            <h2
              id="craft-heading"
              className="mt-5 max-w-[14rem] font-display text-[clamp(2rem,3.4vw,3.15rem)] leading-[0.98] font-semibold tracking-[-0.03em] sm:max-w-[18rem]"
            >
              The finish is in the details.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-concrete">
              Every appointment is built around the small things: clean lines,
              balanced shape and the time to get it right.
            </p>
            <div className="mt-8">
              <TextAction to="/services" tone="light">
                See our services →
              </TextAction>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
