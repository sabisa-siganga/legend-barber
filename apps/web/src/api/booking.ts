import {
  ensureCsrfCookie,
  getApiBaseUrl,
  mutationHeaders,
  resetCsrfCookie,
} from "./client";
import type {
  AvailabilityResult,
  BookingConfirmation,
  BookingFieldErrors,
  BookingFieldName,
  BookingRequest,
  BookingResult,
} from "../types/booking";

export const AVAILABILITY_PATH = "/api/availability";
export const BOOKINGS_PATH = "/api/bookings";

export const SLOT_UNAVAILABLE_CODE = "slot_unavailable";

export const SLOT_UNAVAILABLE_MESSAGE =
  "That time was just booked. Please choose another available time.";

export const NETWORK_MESSAGE =
  "We could not reach the shop. Check your connection and try again.";

export const BOOKING_FAILED_MESSAGE =
  "We could not confirm this booking. Please try again.";

export const AVAILABILITY_FAILED_MESSAGE =
  "Available times could not be loaded. Try another date.";

export const SESSION_FAILED_MESSAGE =
  "We could not start a secure booking session. Please try again.";

const BOOKING_FIELDS: readonly BookingFieldName[] = [
  "serviceId",
  "date",
  "startTime",
  "customerName",
  "email",
  "phone",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const readMessage = (payload: unknown): string | null => {
  if (!isRecord(payload) || typeof payload.message !== "string") {
    return null;
  }

  const message = payload.message.trim();
  return message === "" ? null : message;
};

const readFieldErrors = (payload: unknown): BookingFieldErrors => {
  if (!isRecord(payload)) {
    return {};
  }

  const errors = payload.errors;

  if (!isRecord(errors)) {
    return {};
  }

  return BOOKING_FIELDS.reduce<BookingFieldErrors>((fieldErrors, field) => {
    const messages = errors[field];
    const first = Array.isArray(messages) ? messages[0] : undefined;

    if (typeof first !== "string" || first.trim() === "") {
      return fieldErrors;
    }

    return { ...fieldErrors, [field]: first };
  }, {});
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === "AbortError";

const isBookingConfirmation = (
  value: unknown,
): value is BookingConfirmation => {
  if (!isRecord(value) || !isRecord(value.service)) {
    return false;
  }

  const { service } = value;

  return (
    typeof value.reference === "string" &&
    value.reference !== "" &&
    typeof service.id === "string" &&
    service.id !== "" &&
    typeof service.name === "string" &&
    service.name !== "" &&
    typeof service.price === "number" &&
    Number.isFinite(service.price) &&
    typeof value.date === "string" &&
    value.date !== "" &&
    typeof value.startTime === "string" &&
    value.startTime !== "" &&
    typeof value.endTime === "string" &&
    value.endTime !== "" &&
    typeof value.location === "string" &&
    typeof value.googleCalendarUrl === "string" &&
    typeof value.appleCalendarUrl === "string"
  );
};

const isAvailabilityPayload = (
  value: unknown,
): value is { date: string; slots: string[] } => {
  if (
    !isRecord(value) ||
    typeof value.date !== "string" ||
    !Array.isArray(value.slots)
  ) {
    return false;
  }

  return value.slots.every((slot) => typeof slot === "string");
};

const networkBookingFailure = (): BookingResult => ({
  ok: false,
  kind: "network",
  message: NETWORK_MESSAGE,
  fieldErrors: {},
});

const primeCsrfCookie = async (): Promise<void> => {
  try {
    await ensureCsrfCookie();
  } catch {
    resetCsrfCookie();
  }
};

const postBooking = async (
  request: BookingRequest,
  hasRetried: boolean,
): Promise<Response> => {
  await primeCsrfCookie();

  const response = await fetch(`${getApiBaseUrl()}${BOOKINGS_PATH}`, {
    method: "POST",
    credentials: "include",
    headers: mutationHeaders(),
    body: JSON.stringify(request),
  });

  if (response.status === 419 && !hasRetried) {
    resetCsrfCookie();
    return postBooking(request, true);
  }

  return response;
};

const parseBookingResponse = async (
  response: Response,
): Promise<BookingResult> => {
  const payload = await readJson(response);

  if (response.status === 201) {
    if (!isBookingConfirmation(payload)) {
      return {
        ok: false,
        kind: "rejected",
        message:
          "The booking was saved, but the confirmation details could not be read. Contact the shop before booking again.",
        fieldErrors: {},
      };
    }

    return {
      ok: true,
      confirmation: {
        reference: payload.reference,
        service: {
          id: payload.service.id,
          name: payload.service.name,
          price: payload.service.price,
        },
        date: payload.date,
        startTime: payload.startTime,
        endTime: payload.endTime,
        location: payload.location,
        googleCalendarUrl: payload.googleCalendarUrl,
        appleCalendarUrl: payload.appleCalendarUrl,
      },
    };
  }

  if (
    response.status === 409 &&
    isRecord(payload) &&
    payload.code === SLOT_UNAVAILABLE_CODE
  ) {
    return {
      ok: false,
      kind: "slot_unavailable",
      message: readMessage(payload) ?? SLOT_UNAVAILABLE_MESSAGE,
      fieldErrors: {},
    };
  }

  if (response.status === 422) {
    return {
      ok: false,
      kind: "validation",
      message:
        readMessage(payload) ?? "Check the booking details and try again.",
      fieldErrors: readFieldErrors(payload),
    };
  }

  if (response.status === 419) {
    return {
      ok: false,
      kind: "rejected",
      message: SESSION_FAILED_MESSAGE,
      fieldErrors: {},
    };
  }

  return {
    ok: false,
    kind: "rejected",
    message: readMessage(payload) ?? BOOKING_FAILED_MESSAGE,
    fieldErrors: {},
  };
};

export const fetchAvailability = async (
  date: string,
  signal?: AbortSignal,
): Promise<AvailabilityResult> => {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}${AVAILABILITY_PATH}?date=${encodeURIComponent(date)}`,
      {
        method: "GET",
        cache: "no-store",
        signal,
        headers: { Accept: "application/json" },
      },
    );
    const payload = await readJson(response);

    if (
      response.ok &&
      isAvailabilityPayload(payload) &&
      payload.date === date
    ) {
      return { ok: true, date: payload.date, slots: payload.slots };
    }

    if (response.status === 422) {
      const fieldErrors = readFieldErrors(payload);
      return {
        ok: false,
        kind: "validation",
        message: fieldErrors.date ?? "Enter a valid date.",
      };
    }

    return {
      ok: false,
      kind: "network",
      message: AVAILABILITY_FAILED_MESSAGE,
    };
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, kind: "aborted", message: "" };
    }

    return { ok: false, kind: "network", message: NETWORK_MESSAGE };
  }
};

export const createBooking = async (
  request: BookingRequest,
): Promise<BookingResult> => {
  try {
    const response = await postBooking(request, false);
    return parseBookingResponse(response);
  } catch {
    return networkBookingFailure();
  }
};
