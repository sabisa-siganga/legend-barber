import { formatServicePrice } from "../../lib/services";
import type { Service } from "../../types/service";

type BookingServiceSummaryProps = {
  service: Service;
  titleId: string;
  descriptionId: string;
};

export function BookingServiceSummary({
  service,
  titleId,
  descriptionId,
}: BookingServiceSummaryProps) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-4 border-b border-bone/15 pb-6 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-5">
      <img
        src={service.image}
        alt={service.alt}
        width={1122}
        height={1402}
        className="aspect-[4/5] w-full object-cover object-[center_18%]"
      />
      <div className="min-w-0">
        <h2
          id={titleId}
          className="font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-balance sm:text-[2rem]"
        >
          {service.name}
        </h2>
        <p className="mt-2 text-sm tracking-[0.04em]">
          {formatServicePrice(service.price)}
        </p>
        <p className="mt-3 text-sm leading-6 text-ash">{service.description}</p>
        <p id={descriptionId} className="mt-3 text-sm leading-6 text-ash">
          This service stays fixed for this booking.
        </p>
      </div>
    </div>
  );
}
