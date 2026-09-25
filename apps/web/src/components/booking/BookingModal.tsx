import { useEffect, useId, useRef } from "react";
import { formatServicePrice } from "../../lib/services";
import type { Service } from "../../types/service";

type BookingModalProps = {
  service: Service;
  onClose: () => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  [...root.querySelectorAll<HTMLElement>(focusableSelector)];

export function BookingModal({ service, onClose }: BookingModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || dialogRef.current === null) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Dismiss booking"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto border border-bone/20 bg-ink text-bone"
      >
        <div className="flex items-center justify-between gap-6 border-b border-bone/15 px-6 py-5 sm:px-8">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            BOOKING
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-sm tracking-[0.06em] text-ash underline decoration-rust decoration-1 underline-offset-[7px] transition-colors duration-200 hover:text-bone hover:decoration-bone motion-reduce:transition-none"
          >
            Close
          </button>
        </div>
        <div className="grid gap-6 px-6 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-start sm:px-8 sm:py-8">
          <img
            src={service.image}
            alt={service.alt}
            width={1122}
            height={1402}
            className="aspect-[4/5] w-full object-cover object-[center_18%] sm:max-w-[7.5rem]"
          />
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[0.98] font-semibold tracking-[-0.03em]"
            >
              {service.name}
            </h2>
            <p className="mt-3 text-sm tracking-[0.04em]">
              {formatServicePrice(service.price)}
            </p>
            <p className="mt-4 max-w-[36ch] text-sm leading-6 text-ash">
              {service.description}
            </p>
            <p
              id={descriptionId}
              className="mt-6 border-t border-bone/15 pt-4 text-sm leading-6 text-ash"
            >
              This service stays fixed for this booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
