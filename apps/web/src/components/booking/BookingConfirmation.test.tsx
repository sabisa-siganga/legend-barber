import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookingConfirmation } from "./BookingConfirmation";
import type { BookingConfirmation as BookingConfirmationData } from "../../types/booking";

const confirmation = (
  calendar: Pick<
    BookingConfirmationData,
    "googleCalendarUrl" | "appleCalendarUrl"
  >,
): BookingConfirmationData => ({
  reference: "6f1c0b2e-8a11-4b2e-9c33-111111111111",
  service: { id: "skin-fade", name: "Skin Fade", price: 250 },
  date: "2026-09-26",
  startTime: "10:30",
  endTime: "11:00",
  location: "42 Kloof Street, Gardens, Cape Town",
  googleCalendarUrl: calendar.googleCalendarUrl,
  appleCalendarUrl: calendar.appleCalendarUrl,
});

const renderConfirmation = (
  calendar: Pick<
    BookingConfirmationData,
    "googleCalendarUrl" | "appleCalendarUrl"
  >,
) => {
  render(
    <BookingConfirmation
      confirmation={confirmation(calendar)}
      summaryId="booking-summary"
      headingRef={null}
      onDone={vi.fn()}
    />,
  );
};

describe("booking confirmation calendar actions", () => {
  it("places Google Calendar and the calendar file below the appointment summary", () => {
    renderConfirmation({
      googleCalendarUrl:
        "https://calendar.google.com/calendar/render?action=TEMPLATE",
      appleCalendarUrl:
        "/api/bookings/6f1c0b2e-8a11-4b2e-9c33-111111111111/calendar.ics",
    });

    const summary = screen.getByRole("heading", { name: "Booked" });
    const calendar = screen.getByRole("region", {
      name: "Add it to your calendar",
    });
    const done = screen.getByRole("button", { name: "Done" });
    const googleCalendar = screen.getByRole("link", {
      name: "Add this appointment to Google Calendar. Opens in a new tab.",
    });
    const calendarFile = screen.getByRole("link", {
      name: "Download a calendar file for this appointment.",
    });

    expect(
      summary.compareDocumentPosition(calendar) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(screen.getByText(/Reference/)).toBeInTheDocument();
    expect(
      calendar.compareDocumentPosition(done) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(googleCalendar).toHaveAttribute("target", "_blank");
    expect(googleCalendar).toHaveAttribute("rel", "noopener noreferrer");
    expect(googleCalendar).toHaveClass("bg-rust", "focus-visible:outline");
    expect(calendarFile).toHaveAttribute(
      "href",
      "http://localhost:8000/api/bookings/6f1c0b2e-8a11-4b2e-9c33-111111111111/calendar.ics",
    );
    expect(calendarFile).not.toHaveAttribute("target");
    expect(calendarFile).toHaveClass("focus-visible:outline");
    expect(calendarFile).not.toHaveClass("bg-rust");
    expect(calendarFile).toHaveAccessibleDescription(
      "Works with Apple Calendar and Outlook.",
    );
    expect(googleCalendar.parentElement).toHaveClass(
      "grid-cols-1",
      "sm:grid-cols-2",
    );
    expect(calendar).toHaveClass("border-t");
  });

  it("explains that calendar links are unavailable when both urls are blank", () => {
    renderConfirmation({
      googleCalendarUrl: " ",
      appleCalendarUrl: "",
    });

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.getByText("Calendar links are not available for this booking."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add it to your calendar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  });

  it("omits a blank calendar action and keeps the one that has a url", () => {
    renderConfirmation({
      googleCalendarUrl: "",
      appleCalendarUrl:
        "/api/bookings/6f1c0b2e-8a11-4b2e-9c33-111111111111/calendar.ics",
    });

    expect(
      screen.queryByRole("link", { name: /Google Calendar/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Download a calendar file for this appointment.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Calendar links are not available for this booking."),
    ).not.toBeInTheDocument();
  });
});
