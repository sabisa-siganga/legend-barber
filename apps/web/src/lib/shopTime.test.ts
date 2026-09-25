import { describe, expect, it } from "vitest";
import {
  addShopDays,
  formatBookingDate,
  isCalendarDate,
  isShopSunday,
  shopToday,
} from "./shopTime";

describe("shop time", () => {
  it("uses the Johannesburg calendar date", () => {
    expect(shopToday(new Date("2026-09-25T22:30:00Z"))).toBe("2026-09-26");
    expect(isShopSunday("2026-09-27")).toBe(true);
    expect(isShopSunday("2026-09-26")).toBe(false);
    expect(isCalendarDate("2026-02-31")).toBe(false);
    expect(addShopDays("2026-09-30", 1)).toBe("2026-10-01");
  });

  it("formats a saved booking date for display", () => {
    expect(formatBookingDate("2026-09-26")).toBe("Saturday, 26 September 2026");
  });
});
