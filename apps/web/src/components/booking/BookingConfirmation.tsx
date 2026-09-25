import { useId, type Ref } from "react";
import { absoluteApiUrl } from "../../api/client";
import { formatServicePrice } from "../../lib/services";
import { formatBookingDate } from "../../lib/shopTime";
import type { BookingConfirmation as BookingConfirmationData } from "../../types/booking";

type BookingConfirmationProps = {
  confirmation: BookingConfirmationData;
  summaryId: string;
  headingRef: Ref<HTMLHeadingElement>;
  onDone: () => void;
};

const primaryActionClassName =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 self-start border border-rust bg-rust px-5 py-3 text-sm tracking-[0.04em] text-bone transition-colors duration-200 hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none";

const secondaryActionClassName =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 border border-bone/25 px-5 py-3 text-sm tracking-[0.04em] text-bone transition-colors duration-200 hover:border-bone/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none";

const closeActionClassName =
  "mt-8 inline-flex min-h-11 w-full items-center justify-center border border-bone/25 px-5 py-3 text-sm tracking-[0.04em] text-bone transition-colors duration-200 hover:border-bone/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none";

const hasCalendarTarget = (url: string): boolean => url.trim() !== "";

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
    <path
      d="M6.25 3.75H3.75v8.5h8.5V9.75M8.25 3.75h4v4M12.25 3.75 7.25 8.75"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
    <path
      d="M8 2.75v7.5M5.25 7.75 8 10.5l2.75-2.75M3.25 13.25h9.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export function BookingConfirmation({
  confirmation,
  summaryId,
  headingRef,
  onDone,
}: BookingConfirmationProps) {
  const calendarTitleId = useId();
  const calendarFileHintId = useId();
  const hasGoogleCalendar = hasCalendarTarget(confirmation.googleCalendarUrl);
  const hasCalendarFile = hasCalendarTarget(confirmation.appleCalendarUrl);
  const calendarFileUrl = hasCalendarFile
    ? absoluteApiUrl(confirmation.appleCalendarUrl)
    : "";
  const actionGridClassName = [
    "mt-5 grid min-w-0 grid-cols-1 items-start gap-4",
    hasGoogleCalendar && hasCalendarFile ? "sm:grid-cols-2" : "",
  ]
    .filter((className) => className !== "")
    .join(" ");

  return (
    <div className="mt-8">
      <p className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
        <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
        BOOKED
      </p>
      <h3
        id={summaryId}
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] outline-none"
      >
        Booked
      </h3>
      <p className="mt-4 text-sm tracking-[0.04em]">
        {confirmation.service.name}
        <span className="text-ash"> · </span>
        {formatServicePrice(confirmation.service.price)}
      </p>
      <p className="mt-4 text-sm leading-6 text-bone">
        {formatBookingDate(confirmation.date)}
        <span className="text-ash"> · </span>
        {`${confirmation.startTime}–${confirmation.endTime}`}
      </p>
      {confirmation.location !== "" ? (
        <p className="mt-3 text-sm leading-6 text-ash">
          {confirmation.location}
        </p>
      ) : null}
      <p className="mt-4 text-sm leading-6 text-ash">
        Reference{" "}
        <span className="break-all text-bone">{confirmation.reference}</span>
      </p>
      <section
        aria-labelledby={calendarTitleId}
        className="mt-8 border-t border-bone/15 pt-8"
      >
        <h4
          id={calendarTitleId}
          className="font-display text-[1.35rem] leading-none font-semibold tracking-[-0.03em]"
        >
          Add it to your calendar
        </h4>
        <p className="mt-3 text-sm leading-6 text-ash">
          Keep your appointment close. Add it to the calendar you use.
        </p>
        {hasGoogleCalendar || hasCalendarFile ? (
          <div className={actionGridClassName}>
            {hasGoogleCalendar ? (
              <a
                href={confirmation.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-emphasis="solid"
                aria-label="Add this appointment to Google Calendar. Opens in a new tab."
                className={primaryActionClassName}
              >
                <ExternalLinkIcon />
                Add to Google Calendar
              </a>
            ) : null}
            {hasCalendarFile ? (
              <div className="flex min-w-0 flex-col gap-2 self-start">
                <a
                  href={calendarFileUrl}
                  aria-describedby={calendarFileHintId}
                  aria-label="Download a calendar file for this appointment."
                  className={secondaryActionClassName}
                >
                  <DownloadIcon />
                  Download calendar file
                </a>
                <p
                  id={calendarFileHintId}
                  className="text-xs leading-5 text-ash"
                >
                  Works with Apple Calendar and Outlook.
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-ash">
            Calendar links are not available for this booking.
          </p>
        )}
      </section>
      <button type="button" onClick={onDone} className={closeActionClassName}>
        Done
      </button>
    </div>
  );
}
