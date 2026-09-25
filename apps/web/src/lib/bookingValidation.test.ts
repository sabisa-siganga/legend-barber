import { describe, expect, it } from "vitest";
import { addShopDays, isShopSunday, shopToday } from "./shopTime";
import {
  hasBookingErrors,
  toBookingRequest,
  validateBookingInput,
} from "./bookingValidation";
import type { BookingRequest } from "../types/booking";

const upcomingSunday = (): string => {
  let cursor = shopToday();

  for (let offset = 0; offset < 7; offset += 1) {
    if (isShopSunday(cursor)) {
      return cursor;
    }

    cursor = addShopDays(cursor, 1);
  }

  return cursor;
};

const openDate = (): string => {
  const today = shopToday();
  return isShopSunday(today) ? addShopDays(today, 1) : today;
};

const draft = (overrides: Partial<BookingRequest> = {}): BookingRequest => ({
  serviceId: "signature-cut",
  date: openDate(),
  startTime: "10:30",
  customerName: "Jane Doe",
  email: "jane@example.com",
  phone: "+27 82 123 4567",
  ...overrides,
});

describe("booking validation", () => {
  it("reports every empty required field", () => {
    const errors = validateBookingInput(
      draft({
        date: "",
        startTime: "",
        customerName: "",
        email: "",
        phone: "   ",
      }),
      null,
    );

    expect(errors).toEqual({
      date: "Choose a date.",
      customerName: "Enter your name.",
      email: "Enter your email address.",
      phone: "Enter your phone number.",
    });
    expect(hasBookingErrors(errors)).toBe(true);
  });

  it("rejects a sunday, a past date, and a time the availability list does not include", () => {
    expect(
      validateBookingInput(draft({ date: upcomingSunday() }), ["10:30"]).date,
    ).toBe("Legend Barber is closed on Sundays.");
    expect(
      validateBookingInput(
        draft({
          date: addShopDays(shopToday(), -1),
        }),
        ["10:30"],
      ).date,
    ).toBe("Choose today or a future date.");
    expect(
      validateBookingInput(draft({ startTime: "10:15" }), ["10:30"]).startTime,
    ).toBe("Choose an available time.");
  });

  it("trims contact fields into the booking request", () => {
    expect(
      toBookingRequest(
        draft({
          customerName: "  Jane Doe  ",
          email: " jane@example.com ",
          phone: "  +27 82 123 4567  ",
        }),
      ),
    ).toEqual(draft());
    expect(hasBookingErrors(validateBookingInput(draft(), ["10:30"]))).toBe(
      false,
    );
  });
});
