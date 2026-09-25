import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { BookingModal } from "../components/booking/BookingModal";
import { SiteContainer } from "../components/layout/SiteContainer";
import { ServiceMenu } from "../components/services/ServiceMenu";
import { shopDetails } from "../lib/shopDetails";
import type { BookServiceHandler, Service } from "../types/service";

const serviceListId = "service-list";

export function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Services | ${shopDetails.name}`;

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const onBookService: BookServiceHandler = useCallback((service) => {
    setSelectedService(service);
  }, []);

  const closeBooking = useCallback(() => {
    setSelectedService(null);
  }, []);

  const onChooseServiceAbove = (event: MouseEvent<HTMLAnchorElement>) => {
    const serviceList = document.getElementById(serviceListId);

    if (serviceList === null) {
      return;
    }

    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    serviceList.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    serviceList.focus({ preventScroll: true });
  };

  return (
    <>
      <section className="bg-ink text-bone" aria-labelledby="services-heading">
        <SiteContainer className="py-20 sm:py-24 lg:pt-28 lg:pb-20">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            THE MENU
          </p>
          <h1
            id="services-heading"
            className="mt-5 max-w-[12ch] font-display text-[clamp(2.75rem,5.4vw,4.6rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance"
          >
            Services built around the detail.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ash sm:text-lg sm:leading-8">
            Crown & Blade delivers precise cuts, clean finishes and grooming
            built around the detail.
          </p>
        </SiteContainer>
      </section>
      <ServiceMenu onBookService={onBookService} />
      <section
        className="border-t border-bone/15 bg-ink text-bone"
        aria-labelledby="services-close-heading"
      >
        <SiteContainer className="py-20 sm:py-24 lg:py-28">
          <h2
            id="services-close-heading"
            className="max-w-[16ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance"
          >
            Your next clean finish starts at Crown & Blade.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ash">
            Choose the service that fits your routine, then lock in your time.
          </p>
          <p className="mt-8 text-base text-bone">
            {shopDetails.addressLine1}, {shopDetails.addressLine2}
          </p>
          <div className="mt-8">
            <a
              href={`#${serviceListId}`}
              onClick={onChooseServiceAbove}
              className="group inline-flex text-bone"
            >
              <span className="border-b border-rust pb-1 text-sm tracking-[0.03em] transition-colors duration-200 group-hover:border-bone motion-reduce:transition-none">
                Choose a service above
              </span>
            </a>
          </div>
        </SiteContainer>
      </section>
      {selectedService !== null ? (
        <BookingModal service={selectedService} onClose={closeBooking} />
      ) : null}
    </>
  );
}
