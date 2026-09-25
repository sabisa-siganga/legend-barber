import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AVAILABILITY_PATH,
  BOOKINGS_PATH,
  createBooking,
  fetchAvailability,
  SLOT_UNAVAILABLE_MESSAGE,
} from "./booking";
import type { BookingRequest } from "../types/booking";

const request: BookingRequest = {
  serviceId: "skin-fade",
  date: "2026-09-26",
  startTime: "10:30",
  customerName: "Jane Doe",
  email: "jane@example.com",
  phone: "+27 82 123 4567",
};

const confirmation = {
  reference: "6f1c0b2e-8a11-4b2e-9c33-111111111111",
  service: { id: "skin-fade", name: "Skin Fade", price: 250 },
  date: "2026-09-26",
  startTime: "10:30",
  endTime: "11:00",
  location: "42 Kloof Street, Gardens, Cape Town",
  googleCalendarUrl:
    "https://calendar.google.com/calendar/render?action=TEMPLATE",
  appleCalendarUrl:
    "/api/bookings/6f1c0b2e-8a11-4b2e-9c33-111111111111/calendar.ics",
};

const jsonResponse = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

describe("booking api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads slots for the requested date", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(200, {
          date: "2026-09-26",
          slots: ["10:30", "11:00"],
        }),
      ),
    );

    const result = await fetchAvailability("2026-09-26");

    expect(result).toEqual({
      ok: true,
      date: "2026-09-26",
      slots: ["10:30", "11:00"],
    });
    expect(vi.mocked(fetch).mock.calls[0]?.[0]).toContain(
      `${AVAILABILITY_PATH}?date=2026-09-26`,
    );
  });

  it("posts the booking contract and returns the saved confirmation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse(201, confirmation)),
    );

    const result = await createBooking(request);
    const postCall = vi
      .mocked(fetch)
      .mock.calls.find((call) => String(call[0]).endsWith(BOOKINGS_PATH));
    const init = postCall?.[1];

    expect(result).toEqual({ ok: true, confirmation });
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(init?.method).toBe("POST");
    expect(init?.credentials).toBeUndefined();
    expect(JSON.parse(String(init?.body))).toEqual(request);
    expect(init?.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  });

  it("returns field errors and a taken-slot failure without dropping the message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(422, {
          message: "Enter a valid email address.",
          errors: { email: ["Enter a valid email address."] },
        }),
      ),
    );

    const invalid = await createBooking(request);

    expect(invalid).toMatchObject({
      ok: false,
      kind: "validation",
      fieldErrors: { email: "Enter a valid email address." },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(409, {
          message: SLOT_UNAVAILABLE_MESSAGE,
          code: "slot_unavailable",
        }),
      ),
    );

    const taken = await createBooking(request);

    expect(taken).toEqual({
      ok: false,
      kind: "slot_unavailable",
      message: SLOT_UNAVAILABLE_MESSAGE,
      fieldErrors: {},
    });
  });

  it("reports a network failure when the booking request cannot be sent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(createBooking(request)).resolves.toMatchObject({
      ok: false,
      kind: "network",
    });
  });
});
