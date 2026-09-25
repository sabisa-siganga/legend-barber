import { formatServicePrice, services } from "../../lib/services";
import type { BookServiceHandler, Service } from "../../types/service";
import { SiteContainer } from "../layout/SiteContainer";

type ServiceMenuProps = {
  onBookService: BookServiceHandler;
};

type ServiceRowProps = {
  service: Service;
  index: number;
  onBookService: BookServiceHandler;
};

const ServiceRow = ({ service, index, onBookService }: ServiceRowProps) => {
  const imageLeads = index % 2 === 0;
  const indexLabel = String(index + 1).padStart(2, "0");
  const headingId = `service-${service.id}`;
  const imageFrameClassName = imageLeads
    ? "aspect-[4/5]"
    : "aspect-[4/5] lg:aspect-[5/4]";

  return (
    <li className="border-b border-bone/15 py-14 sm:py-16 lg:py-24">
      <article
        aria-labelledby={headingId}
        className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24"
      >
        <div
          className={`min-w-0 overflow-hidden border-t border-bone/20 ${imageLeads ? "" : "lg:order-2"}`}
        >
          <img
            src={service.image}
            alt={service.alt}
            width={1122}
            height={1402}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`${imageFrameClassName} w-full object-cover object-[center_18%] transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
          />
        </div>
        <div
          className={`min-w-0 ${imageLeads ? "" : "lg:order-1 lg:border-l lg:border-rust lg:pl-10"}`}
        >
          {imageLeads ? (
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id={headingId}
                className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-200 group-hover:decoration-rust motion-reduce:transition-none"
              >
                {service.name}
              </h2>
              <span className="text-xs tracking-[0.16em] text-ash">
                {indexLabel}
              </span>
            </div>
          ) : (
            <>
              <p className="text-xs tracking-[0.16em] text-ash">{indexLabel}</p>
              <h2
                id={headingId}
                className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-200 group-hover:decoration-rust motion-reduce:transition-none"
              >
                {service.name}
              </h2>
            </>
          )}
          <p className="mt-4 text-sm tracking-[0.04em] text-bone">
            {formatServicePrice(service.price)}
          </p>
          <p className="mt-4 max-w-[36ch] text-base leading-7 text-ash">
            {service.description}
          </p>
          <div className="mt-8">
            <button
              type="button"
              data-emphasis="solid"
              onClick={() => {
                onBookService(service);
              }}
              className="inline-flex items-center justify-center border border-rust bg-rust px-5 py-3 text-sm tracking-[0.04em] whitespace-nowrap text-bone transition-colors duration-200 hover:bg-transparent motion-reduce:transition-none"
            >
              Book this service
              <span className="sr-only">, {service.name}</span>
            </button>
          </div>
        </div>
      </article>
    </li>
  );
};

export function ServiceMenu({ onBookService }: ServiceMenuProps) {
  return (
    <section
      id="service-list"
      aria-label="The menu"
      tabIndex={-1}
      className="scroll-mt-8 bg-ink text-bone outline-none"
    >
      <SiteContainer>
        <ol className="border-t border-bone/15">
          {services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              onBookService={onBookService}
            />
          ))}
        </ol>
      </SiteContainer>
    </section>
  );
}
