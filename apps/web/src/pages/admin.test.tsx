import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppRoutes } from "../App";

const API_ORIGIN = "http://localhost:8000";

const LocationProbe = () => {
  const { pathname } = useLocation();

  return <div data-testid="location">{pathname}</div>;
};

const renderAt = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <AppRoutes />
    </MemoryRouter>,
  );
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type FlatBooking = {
  reference: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  price: number;
  customerName: string;
  email: string;
  phone: string;
  created_at?: string;
};

const flatBooking = (overrides: Partial<FlatBooking> = {}): FlatBooking => ({
  reference: "LB-2048",
  startTime: "10:30",
  endTime: "11:00",
  serviceName: "Signature Cut",
  price: 220,
  customerName: "Jane Doe",
  email: "jane@example.com",
  phone: "+27 82 123 4567",
  created_at: "2026-09-25T08:00:00.000000Z",
  ...overrides,
});

const bookingsPayload = (date: string, bookings: readonly FlatBooking[]) =>
  jsonResponse({ date, bookings });

type FetchMock = ReturnType<typeof vi.fn>;

const installFetch = ({
  onSession = () => jsonResponse({ authenticated: true }),
  onLogin = () => jsonResponse({ authenticated: true }),
  onLogout = () => jsonResponse({ authenticated: false }),
  onBookings = (url: string) => {
    const date = new URL(url).searchParams.get("date") ?? "";

    return bookingsPayload(date, []);
  },
}: {
  onSession?: () => Response;
  onLogin?: (init?: RequestInit) => Response | Promise<Response>;
  onLogout?: () => Response;
  onBookings?: (url: string) => Response;
} = {}) => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url === `${API_ORIGIN}/sanctum/csrf-cookie`) {
      document.cookie = "XSRF-TOKEN=test-token";
      return new Response(null, { status: 204 });
    }

    if (url === `${API_ORIGIN}/api/admin/login`) {
      return onLogin(init);
    }

    if (url === `${API_ORIGIN}/api/admin/logout`) {
      return onLogout();
    }

    if (url === `${API_ORIGIN}/api/admin/session`) {
      return onSession();
    }

    if (url.startsWith(`${API_ORIGIN}/api/admin/bookings`)) {
      return onBookings(url);
    }

    return new Response("not found", { status: 404 });
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
};

const calledUrl = (fetchMock: FetchMock, fragment: string) =>
  fetchMock.mock.calls.find((call) => String(call[0]).includes(fragment));

describe("admin area", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-25T08:00:00.000Z"));
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.cookie = "XSRF-TOKEN=; Max-Age=0";
  });

  it("redirects an unauthenticated admin visit to the login page", async () => {
    installFetch({
      onSession: () => jsonResponse({ authenticated: false }),
    });
    renderAt("/admin");

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).toBe("/admin/login");
    });
    expect(
      screen.getByRole("heading", { name: "Admin access" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Book Now" })).not.toBeInTheDocument();
  });

  it("navigates to the dashboard after a successful login", async () => {
    const user = userEvent.setup();
    let releaseLogin: (response: Response) => void = () => {};
    const pendingLogin = new Promise<Response>((resolve) => {
      releaseLogin = resolve;
    });
    const fetchMock = installFetch({
      onLogin: () => pendingLogin,
      onBookings: (url) =>
        bookingsPayload(new URL(url).searchParams.get("date") ?? "", [
          flatBooking(),
        ]),
    });
    renderAt("/admin/login");

    expect(screen.getByLabelText("Username")).toHaveValue("");
    await user.type(screen.getByLabelText("Username"), "owner");
    await user.type(screen.getByLabelText("Password"), "secret");
    const pendingClick = user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("button", { name: "Signing in…" })).toBeDisabled();
    releaseLogin(jsonResponse({ authenticated: true }));
    await pendingClick;

    expect(await screen.findByRole("heading", { name: "Bookings" })).toBeInTheDocument();
    expect(screen.getByTestId("location").textContent).toBe("/admin");

    const csrfCall = calledUrl(fetchMock, "/sanctum/csrf-cookie");
    const loginCall = calledUrl(fetchMock, "/api/admin/login");
    expect(csrfCall).toBeDefined();
    expect(loginCall?.[1]).toEqual(
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username: "owner", password: "secret" }),
      }),
    );
    expect(new Headers(loginCall?.[1]?.headers).get("X-XSRF-TOKEN")).toBe("test-token");
    expect(fetchMock.mock.calls.findIndex((call) => String(call[0]).includes("csrf-cookie")))
      .toBeLessThan(
        fetchMock.mock.calls.findIndex((call) => String(call[0]).includes("/api/admin/login")),
      );
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it("shows the returned login error and keeps the entered username", async () => {
    const user = userEvent.setup();
    installFetch({
      onLogin: () =>
        jsonResponse(
          {
            message: "The provided credentials are incorrect.",
            errors: {
              username: ["The provided credentials are incorrect."],
            },
          },
          422,
        ),
    });
    renderAt("/admin/login");

    await user.type(screen.getByLabelText("Username"), "owner");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("The provided credentials are incorrect.");
    await waitFor(() => {
      expect(alert).toHaveFocus();
    });
    expect(screen.getByLabelText("Username")).toHaveValue("owner");
    expect(screen.getByTestId("location").textContent).toBe("/admin/login");
  });

  it("loads today's Johannesburg bookings by default", async () => {
    const fetchMock = installFetch({
      onBookings: (url) => {
        const date = new URL(url).searchParams.get("date") ?? "";

        if (date !== "2026-09-25") {
          return bookingsPayload(date, []);
        }

        return bookingsPayload(date, [flatBooking()]);
      },
    });
    renderAt("/admin");

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Friday, 25 September 2026")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveValue("2026-09-25");
    expect(screen.getByText("10:30–11:00")).toBeInTheDocument();
    expect(screen.getByText("Signature Cut")).toBeInTheDocument();
    expect(screen.getByText("R220")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("+27 82 123 4567")).toBeInTheDocument();
    expect(screen.getByText("LB-2048")).toBeInTheDocument();
    expect(screen.queryByText(/2026-09-25T08:00:00/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Book Now" })).not.toBeInTheDocument();

    const bookingsCall = calledUrl(fetchMock, "/api/admin/bookings?date=2026-09-25");
    expect(bookingsCall?.[1]).toEqual(
      expect.objectContaining({ credentials: "include" }),
    );
    expect(calledUrl(fetchMock, "/api/admin/session")?.[1]).toEqual(
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("fetches bookings for the date the admin selects", async () => {
    const fetchMock = installFetch({
      onBookings: (url) => {
        const date = new URL(url).searchParams.get("date") ?? "";

        if (date === "2026-09-28") {
          return bookingsPayload(date, [
            flatBooking({
              reference: "LB-3001",
              startTime: "09:00",
              endTime: "09:30",
              serviceName: "Skin Fade",
              price: 250,
              customerName: "Sam Nkosi",
              email: "sam@example.com",
              phone: "+27 82 000 1111",
            }),
          ]);
        }

        return bookingsPayload(date, [flatBooking()]);
      },
    });
    renderAt("/admin");

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-09-28" },
    });

    expect(await screen.findByText("Sam Nkosi")).toBeInTheDocument();
    expect(screen.getByText("Monday, 28 September 2026")).toBeInTheDocument();
    expect(calledUrl(fetchMock, "/api/admin/bookings?date=2026-09-28")).toBeDefined();
  });

  it("returns to today's bookings from the Today action", async () => {
    const user = userEvent.setup();
    installFetch({
      onBookings: (url) => {
        const date = new URL(url).searchParams.get("date") ?? "";

        if (date === "2026-09-28") {
          return bookingsPayload(date, [
            flatBooking({
              reference: "LB-3001",
              customerName: "Sam Nkosi",
            }),
          ]);
        }

        return bookingsPayload(date, [flatBooking()]);
      },
    });
    renderAt("/admin");

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-09-28" },
    });
    expect(await screen.findByText("Sam Nkosi")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Today" }));

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveValue("2026-09-25");
    expect(screen.getByText("Friday, 25 September 2026")).toBeInTheDocument();
  });

  it("shows the empty state when the selected date has no bookings", async () => {
    installFetch({
      onBookings: (url) =>
        bookingsPayload(new URL(url).searchParams.get("date") ?? "", []),
    });
    renderAt("/admin");

    expect(await screen.findByText("No bookings for this date.")).toBeInTheDocument();
    expect(
      screen.getByText("Crown & Blade has no confirmed appointments scheduled."),
    ).toBeInTheDocument();
  });

  it("redirects to login when a bookings request returns 401", async () => {
    installFetch({
      onBookings: () => jsonResponse({ message: "Unauthenticated." }, 401),
    });
    renderAt("/admin");

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).toBe("/admin/login");
    });
    expect(
      screen.queryByText("We could not load bookings for this date. Please try again."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  it("logs out through the admin endpoint and returns to login", async () => {
    const user = userEvent.setup();
    const fetchMock = installFetch({
      onBookings: (url) =>
        bookingsPayload(new URL(url).searchParams.get("date") ?? "", [
          flatBooking(),
        ]),
    });
    renderAt("/admin");

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).toBe("/admin/login");
    });
    expect(calledUrl(fetchMock, "/api/admin/logout")?.[1]).toEqual(
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
  });

  it("still returns to login when logout finds an expired session", async () => {
    const user = userEvent.setup();
    installFetch({
      onBookings: (url) =>
        bookingsPayload(new URL(url).searchParams.get("date") ?? "", [
          flatBooking(),
        ]),
      onLogout: () => jsonResponse({ message: "Unauthenticated." }, 401),
    });
    renderAt("/admin");

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).toBe("/admin/login");
    });
  });

  it("renders bookings in chronological order", async () => {
    installFetch({
      onBookings: (url) =>
        bookingsPayload(new URL(url).searchParams.get("date") ?? "", [
          flatBooking({
            reference: "LB-3",
            startTime: "14:00",
            endTime: "14:30",
            customerName: "Late Guest",
          }),
          flatBooking({
            reference: "LB-1",
            startTime: "09:00",
            endTime: "09:30",
            customerName: "Early Guest",
          }),
          flatBooking({
            reference: "LB-2",
            startTime: "11:30",
            endTime: "12:00",
            customerName: "Mid Guest",
          }),
        ]),
    });
    renderAt("/admin");

    expect(await screen.findByText("Early Guest")).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("09:00–09:30");
    expect(rows[1]).toHaveTextContent("Early Guest");
    expect(rows[2]).toHaveTextContent("11:30–12:00");
    expect(rows[2]).toHaveTextContent("Mid Guest");
    expect(rows[3]).toHaveTextContent("14:00–14:30");
    expect(rows[3]).toHaveTextContent("Late Guest");
  });

  it("shows fixed shop hours without edit controls", async () => {
    installFetch();
    renderAt("/admin");

    const panel = await screen.findByRole("region", { name: "Shop hours" });
    expect(within(panel).getByText("Monday–Saturday")).toBeInTheDocument();
    expect(within(panel).getByText("08:00–17:00")).toBeInTheDocument();
    expect(within(panel).getByText("Sunday")).toBeInTheDocument();
    expect(within(panel).getByText("Closed")).toBeInTheDocument();
    expect(within(panel).getByText("Public holidays")).toBeInTheDocument();
    expect(
      within(panel).getByText("Open Monday–Saturday hours when applicable"),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText("42 Kloof Street, Gardens, Cape Town"),
    ).toBeInTheDocument();
    expect(within(panel).queryByRole("button")).not.toBeInTheDocument();
    expect(within(panel).queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("keeps loaded bookings visible when a later date request fails", async () => {
    const user = userEvent.setup();
    let failNext = false;
    installFetch({
      onBookings: (url) => {
        const date = new URL(url).searchParams.get("date") ?? "";

        if (failNext) {
          return jsonResponse({ message: "Server error" }, 500);
        }

        if (date === "2026-09-28") {
          return bookingsPayload(date, [
            flatBooking({
              reference: "LB-3001",
              customerName: "Sam Nkosi",
            }),
          ]);
        }

        return bookingsPayload(date, [flatBooking()]);
      },
    });
    renderAt("/admin");

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    failNext = true;
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-09-28" },
    });

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "We could not load bookings for this date. Please try again.",
    );
    expect(screen.getByLabelText("Date")).toHaveValue("2026-09-28");
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("Sam Nkosi")).not.toBeInTheDocument();

    failNext = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Sam Nkosi")).toBeInTheDocument();
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
