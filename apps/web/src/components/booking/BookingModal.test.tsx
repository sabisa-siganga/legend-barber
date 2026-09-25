import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingModal } from "./BookingModal";
import { SLOT_UNAVAILABLE_MESSAGE } from "../../api/booking";
import { resetCsrfCookie } from "../../api/client";
import { services } from "../../lib/services";
import { addShopDays, isShopSunday, shopToday } from "../../lib/shopTime";
import type { Service } from "../../types/service";

const skinFade = services.find((service) => service.id === "skin-fade");

if (skinFade === undefined) {
  throw new Error("Skin Fade is missing from the service menu.");
}

const openDate = (): string => {
  const today = shopToday();
  return isShopSunday(today) ? addShopDays(today, 1) : today;
};

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

type FetchResult = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

const jsonResponse = (status: number, body: unknown): FetchResult => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const confirmationBody = {
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

const installFetch = (
  bookingResponse: () => FetchResult | Promise<FetchResult>,
) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith("/sanctum/csrf-cookie")) {
        document.cookie = "XSRF-TOKEN=csrf-token";
        return jsonResponse(204, null);
      }

      if (url.includes("/api/availability")) {
        const date = new URL(url).searchParams.get("date") ?? "";
        const slots =
          date < shopToday() || isShopSunday(date) ? [] : ["10:30", "11:00"];
        return jsonResponse(200, { date, slots });
      }

      return bookingResponse();
    }),
  );

  return {
    initForPost: () =>
      vi
        .mocked(fetch)
        .mock.calls.find(
          (call) =>
            String(call[0]).endsWith("/api/bookings") &&
            call[1]?.method === "POST",
        )?.[1],
  };
};

const renderModal = (service: Service = skinFade, onClose = vi.fn()) => {
  render(<BookingModal service={service} onClose={onClose} />);
  return onClose;
};

const fillContact = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Full name"), "Jane Doe");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  await user.type(screen.getByLabelText("Phone"), "+27 82 123 4567");
};

const chooseSlot = async (date = openDate()) => {
  fireEvent.change(screen.getByLabelText("Date"), { target: { value: date } });
  const slot = await screen.findByRole("radio", { name: "10:30" });
  fireEvent.click(slot);
};

describe("booking modal", () => {
  afterEach(() => {
    sessionStorage.clear();
    resetCsrfCookie();
    vi.unstubAllGlobals();
    document.cookie = "XSRF-TOKEN=; Max-Age=0";
    document.body.style.overflow = "";
  });

  it("stays closed without a valid service and keeps a valid service fixed", () => {
    const { container, unmount } = render(
      <BookingModal service={{ ...skinFade, id: " " }} onClose={vi.fn()} />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(container.querySelector("[role='dialog']")).toBeNull();
    unmount();

    renderModal();
    const dialog = screen.getByRole("dialog");

    expect(
      within(dialog).getByRole("heading", { name: "Skin Fade" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("R250")).toBeInTheDocument();
    expect(within(dialog).getByText(skinFade.description)).toBeInTheDocument();
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      skinFade.image,
    );
    expect(
      within(dialog).getByText("This service stays fixed for this booking."),
    ).toBeInTheDocument();
    expect(dialog.querySelector("select")).toBeNull();
    expect(within(dialog).queryByLabelText(/barber/i)).not.toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("shows inline errors and keeps typed values when required details are missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText("Full name"), "J");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(screen.getByText("Choose a date.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a name between 2 and 100 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter your phone number.")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveValue("J");
    expect(screen.getByLabelText("Email")).toHaveValue("not-an-email");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the backend booking contract and shows the saved confirmation", async () => {
    const booking = installFetch(() =>
      jsonResponse(201, {
        ...confirmationBody,
        date: openDate(),
      }),
    );
    const onClose = renderModal();

    await fillContact();
    await chooseSlot();
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(
      await screen.findByText(confirmationBody.reference),
    ).toBeInTheDocument();
    expect(screen.getByText(/10:30–11:00/)).toBeInTheDocument();
    expect(screen.getByText(confirmationBody.location)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Confirm booking" }),
    ).not.toBeInTheDocument();
    const googleCalendar = screen.getByRole("link", {
      name: "Add this appointment to Google Calendar. Opens in a new tab.",
    });
    expect(googleCalendar).toHaveAttribute(
      "href",
      confirmationBody.googleCalendarUrl,
    );
    expect(googleCalendar).toHaveAttribute("target", "_blank");
    expect(googleCalendar).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", {
        name: "Download a calendar file for this appointment.",
      }),
    ).toHaveAttribute(
      "href",
      `http://localhost:8000${confirmationBody.appleCalendarUrl}`,
    );
    expect(
      screen.getByRole("heading", { name: "Add it to your calendar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Keep your appointment close. Add it to the calendar you use.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Works with Apple Calendar and Outlook."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Add to Apple Calendar" }),
    ).not.toBeInTheDocument();

    const body = JSON.parse(String(booking.initForPost()?.body));
    expect(body).toEqual({
      serviceId: "skin-fade",
      date: openDate(),
      startTime: "10:30",
      customerName: "Jane Doe",
      email: "jane@example.com",
      phone: "+27 82 123 4567",
    });

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("disables confirm while the booking is in flight and ignores a second submit", async () => {
    let release: (response: FetchResult) => void = () => {};
    const pending = new Promise<FetchResult>((resolve) => {
      release = resolve;
    });
    installFetch(() => pending);
    const onClose = renderModal();

    await fillContact();
    await chooseSlot();
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Confirming booking…",
    });
    expect(pendingButton).toBeDisabled();
    fireEvent.click(pendingButton);
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Dismiss booking" }));

    expect(onClose).not.toHaveBeenCalled();
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter((call) => String(call[0]).endsWith("/api/bookings")),
    ).toHaveLength(1);

    release(jsonResponse(201, { ...confirmationBody, date: openDate() }));
    expect(
      await screen.findByRole("button", { name: "Done" }),
    ).toBeInTheDocument();
  });

  it("keeps the form and explains a taken slot or a validation error", async () => {
    installFetch(() =>
      jsonResponse(409, {
        message: SLOT_UNAVAILABLE_MESSAGE,
        code: "slot_unavailable",
      }),
    );
    renderModal();
    await fillContact();
    await chooseSlot();
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      SLOT_UNAVAILABLE_MESSAGE,
    );
    expect(screen.getByLabelText("Full name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Date")).toHaveValue(openDate());
    expect(
      screen.queryByRole("button", { name: "Done" }),
    ).not.toBeInTheDocument();

    vi.mocked(fetch).mockImplementation((async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith("/sanctum/csrf-cookie")) {
        return jsonResponse(204, null);
      }

      if (url.includes("/api/availability")) {
        const date = new URL(url).searchParams.get("date") ?? "";
        return jsonResponse(200, { date, slots: ["11:00"] });
      }

      return jsonResponse(422, {
        message: "Enter a valid email address.",
        errors: { email: ["Enter a valid email address."] },
      });
    }) as typeof fetch);
    resetCsrfCookie();

    fireEvent.click(await screen.findByRole("radio", { name: "11:00" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Phone")).toHaveValue("+27 82 123 4567");
  });

  it("shows a network failure without claiming the booking was saved", async () => {
    installFetch(() => Promise.reject(new Error("offline")));
    renderModal();
    await fillContact();
    await chooseSlot();
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not reach the shop. Check your connection and try again.",
    );
    expect(screen.queryByText(/booked/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirm booking" }),
    ).toBeEnabled();
  });

  it("explains that sunday has no bookable times", async () => {
    installFetch(() => jsonResponse(201, confirmationBody));
    renderModal();
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: upcomingSunday() },
    });

    expect(
      await screen.findByText("Crown & Blade is closed on Sundays."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("prefills contact details for the next booking and leaves the appointment blank", async () => {
    installFetch(() =>
      jsonResponse(201, { ...confirmationBody, date: openDate() }),
    );
    const onClose = renderModal();
    await fillContact();
    await chooseSlot();
    fireEvent.click(screen.getByRole("button", { name: "Confirm booking" }));
    await screen.findByRole("button", { name: "Done" });
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledOnce();

    renderModal();
    expect(screen.getByLabelText("Full name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Phone")).toHaveValue("+27 82 123 4567");
    expect(screen.getByLabelText("Date")).toHaveValue("");
    expect(
      screen.queryByRole("radio", { name: "10:30" }),
    ).not.toBeInTheDocument();
  });
});
