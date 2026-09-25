import { getApiBaseUrl } from "./health";
import type { AdminBooking, AdminBookingsResult, AdminLoginResult } from "../types/admin";

const LOGIN_FAILURE_MESSAGE = "We could not sign you in. Please try again.";

type FlatAdminBooking = {
  readonly id?: number | string;
  readonly reference: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly serviceName: string;
  readonly serviceId?: string;
  readonly price: number;
  readonly customerName: string;
  readonly email: string;
  readonly phone: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readOptionalId = (value: unknown): number | string | undefined => {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return undefined;
};

const isFlatAdminBooking = (value: unknown): value is FlatAdminBooking => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.reference === "string"
    && typeof value.startTime === "string"
    && typeof value.endTime === "string"
    && typeof value.serviceName === "string"
    && typeof value.price === "number"
    && Number.isFinite(value.price)
    && typeof value.customerName === "string"
    && typeof value.email === "string"
    && typeof value.phone === "string"
  );
};

const toAdminBooking = (booking: FlatAdminBooking, bookingDate: string): AdminBooking => {
  const serviceId = typeof booking.serviceId === "string" ? booking.serviceId : undefined;
  const id = readOptionalId(booking.id);

  return {
    ...(id === undefined ? {} : { id }),
    reference: booking.reference,
    bookingDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
    service: {
      ...(serviceId === undefined ? {} : { id: serviceId }),
      name: booking.serviceName,
      price: booking.price,
    },
    customer: {
      name: booking.customerName,
      email: booking.email,
      phone: booking.phone,
    },
  };
};

const sortByStartTime = (bookings: readonly AdminBooking[]): AdminBooking[] =>
  [...bookings].sort((left, right) => left.startTime.localeCompare(right.startTime));

const readXsrfToken = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  const token = match?.[1];

  if (token === undefined || token === "") {
    return null;
  }

  return decodeURIComponent(token);
};

const ensureCsrfCookie = async (): Promise<void> => {
  await fetch(`${getApiBaseUrl()}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

const adminHeaders = (includeJsonBody: boolean): Headers => {
  const headers = new Headers({
    Accept: "application/json",
  });

  if (includeJsonBody) {
    headers.set("Content-Type", "application/json");
  }

  const token = readXsrfToken();

  if (token !== null) {
    headers.set("X-XSRF-TOKEN", token);
  }

  return headers;
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload: unknown = await response.json();

    if (
      isRecord(payload)
      && typeof payload.message === "string"
      && payload.message.trim() !== ""
    ) {
      return payload.message;
    }
  } catch {
    return LOGIN_FAILURE_MESSAGE;
  }

  return LOGIN_FAILURE_MESSAGE;
};

export const fetchAdminSession = async (): Promise<{ authenticated: boolean }> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/session`, {
      credentials: "include",
      headers: adminHeaders(false),
    });

    if (response.status === 401 || !response.ok) {
      return { authenticated: false };
    }

    const payload: unknown = await response.json();

    return {
      authenticated: isRecord(payload) && payload.authenticated === true,
    };
  } catch {
    return { authenticated: false };
  }
};

export const loginAdmin = async ({
  username,
  password,
}: {
  readonly username: string;
  readonly password: string;
}): Promise<AdminLoginResult> => {
  try {
    await ensureCsrfCookie();
    const response = await fetch(`${getApiBaseUrl()}/api/admin/login`, {
      method: "POST",
      credentials: "include",
      headers: adminHeaders(true),
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return { ok: false, message: await readErrorMessage(response) };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: LOGIN_FAILURE_MESSAGE };
  }
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    await ensureCsrfCookie();
    await fetch(`${getApiBaseUrl()}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
      headers: adminHeaders(true),
    });
  } catch {
    // An expired session should still leave the admin screen.
  }
};

export const fetchAdminBookings = async (date: string): Promise<AdminBookingsResult> => {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/admin/bookings?date=${encodeURIComponent(date)}`,
      {
        credentials: "include",
        headers: adminHeaders(false),
      },
    );

    if (response.status === 401) {
      return { ok: false, reason: "unauthorized" };
    }

    if (!response.ok) {
      return { ok: false, reason: "failed" };
    }

    const payload: unknown = await response.json();

    if (!isRecord(payload) || !Array.isArray(payload.bookings)) {
      return { ok: false, reason: "failed" };
    }

    const { date: bookingDate, bookings: rawBookings } = payload;

    if (typeof bookingDate !== "string") {
      return { ok: false, reason: "failed" };
    }

    const bookings = rawBookings.flatMap((booking) => (
      isFlatAdminBooking(booking) ? [toAdminBooking(booking, bookingDate)] : []
    ));

    if (bookings.length !== rawBookings.length) {
      return { ok: false, reason: "failed" };
    }

    return {
      ok: true,
      bookings: sortByStartTime(bookings),
    };
  } catch {
    return { ok: false, reason: "failed" };
  }
};
