import { useCallback, useEffect, useId, useRef, useState } from "react";
import { isBookableService } from "../../lib/services";
import type { BookingConfirmation as BookingConfirmationData } from "../../types/booking";
import type { Service } from "../../types/service";
import { BookingConfirmation } from "./BookingConfirmation";
import { BookingForm } from "./BookingForm";
import { BookingServiceSummary } from "./BookingServiceSummary";

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
  [...root.querySelectorAll<HTMLElement>(focusableSelector)].filter(
    (element) => element.getAttribute("aria-hidden") !== "true",
  );

const focusAfter = (
  focusable: readonly HTMLElement[],
  active: HTMLElement,
  shiftKey: boolean,
): HTMLElement => {
  if (shiftKey) {
    const previous = [...focusable]
      .reverse()
      .find(
        (element) =>
          (active.compareDocumentPosition(element) &
            Node.DOCUMENT_POSITION_PRECEDING) !==
          0,
      );
    return previous ?? focusable[focusable.length - 1];
  }

  const next = focusable.find(
    (element) =>
      (active.compareDocumentPosition(element) &
        Node.DOCUMENT_POSITION_FOLLOWING) !==
      0,
  );
  return next ?? focusable[0];
};

export function BookingModal({ service, onClose }: BookingModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const confirmationId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const isSubmittingRef = useRef(false);
  const canOpen = isBookableService(service);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationData | null>(null);

  const onSubmittingChange = useCallback((nextIsSubmitting: boolean) => {
    isSubmittingRef.current = nextIsSubmitting;
    setIsSubmitting(nextIsSubmitting);
  }, []);

  const requestClose = useCallback(() => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!canOpen) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isSubmittingRef.current) {
          return;
        }

        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || dialogRef.current === null) {
        return;
      }

      const dialog = dialogRef.current;
      const focusable = getFocusableElements(dialog);

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const active = document.activeElement;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!(active instanceof HTMLElement) || !dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      const currentIndex = focusable.indexOf(active);

      if (currentIndex === -1) {
        event.preventDefault();
        focusAfter(focusable, active, event.shiftKey).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
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
  }, [canOpen, onClose]);

  useEffect(() => {
    if (confirmation === null) {
      return;
    }

    confirmationHeadingRef.current?.focus();
  }, [confirmation]);

  if (!canOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Dismiss booking"
        disabled={isSubmitting}
        className="absolute inset-0 bg-black/70 disabled:cursor-default"
        onClick={requestClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={
          confirmation === null ? descriptionId : confirmationId
        }
        tabIndex={-1}
        className="relative z-10 max-h-[calc(100dvh-1.5rem)] w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain border border-bone/20 bg-ink text-bone outline-none sm:max-h-[calc(100dvh-3rem)] sm:max-w-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-bone/15 bg-ink px-5 py-4 sm:px-8">
          <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
            <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
            BOOKING
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            disabled={isSubmitting}
            onClick={requestClose}
            className="inline-flex size-11 shrink-0 items-center justify-center border border-bone/25 text-bone transition-colors duration-200 hover:border-rust focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
              <path
                d="M3.2 3.2 12.8 12.8M12.8 3.2 3.2 12.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <div className="px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-8">
          <BookingServiceSummary
            service={service}
            titleId={titleId}
            descriptionId={descriptionId}
          />
          {confirmation === null ? (
            <BookingForm
              service={service}
              onConfirmed={setConfirmation}
              onSubmittingChange={onSubmittingChange}
            />
          ) : (
            <BookingConfirmation
              confirmation={confirmation}
              summaryId={confirmationId}
              headingRef={confirmationHeadingRef}
              onDone={requestClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
