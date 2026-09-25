import mark from "../../assets/brand/crown-and-blade-mark.svg";
import { SiteContainer } from "../layout/SiteContainer";

export function BrandStatement() {
  return (
    <section className="bg-bone text-ink" aria-labelledby="brand-statement">
      <SiteContainer className="grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-16 lg:py-28">
        <div className="flex items-end justify-between gap-8 lg:col-span-4 lg:block">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-concrete">
              THE STANDARD
            </p>
            <div className="mt-5 h-px w-12 bg-rust" aria-hidden="true" />
          </div>
          <img
            src={mark}
            alt="Crown and Blade mark"
            width={160}
            height={160}
            className="h-12 w-12 lg:mt-10"
          />
        </div>
        <div className="lg:col-span-8">
          <p
            id="brand-statement"
            className="max-w-[38rem] font-display text-[clamp(1.7rem,2.7vw,2.5rem)] leading-[1.18] font-semibold tracking-[-0.03em]"
          >
            Crown and Blade is a space for sharp work, good energy and a look
            that holds up long after you leave.
          </p>
          <p className="mt-6 max-w-xl text-base leading-7 text-concrete">
            Built around discipline, detail and a standard you can feel in every
            finish.
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}
