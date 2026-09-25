import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";

const renderAt = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
};

const contactDetails = () =>
  screen.getByRole("region", { name: "Contact details" });

describe("contact page", () => {
  it("sets the contact document title", () => {
    renderAt("/contact");

    expect(document.title).toBe("Contact | Crown and Blade");
  });

  it("introduces the Gardens shop and lists the street address", () => {
    renderAt("/contact");

    expect(screen.getByText("CONTACT")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Find your next clean finish.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Visit Crown & Blade in Gardens, Cape Town, or get in touch before your next appointment.",
      ),
    ).toBeInTheDocument();

    const details = contactDetails();
    const visit = within(details).getByText("42 Kloof Street");
    expect(visit.closest("a")).toBeNull();
    expect(
      within(details).getByText("Gardens, Cape Town"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Barber chairs and mirrors inside the Crown and Blade shop",
      }),
    ).toBeInTheDocument();
  });

  it("links the phone and email with working tel and mailto targets", () => {
    renderAt("/contact");

    const details = contactDetails();
    expect(
      within(details).getByRole("link", { name: "+27 11 555 0188" }),
    ).toHaveAttribute("href", "tel:+27115550188");
    expect(
      within(details).getByRole("link", { name: "hello@crownandblade.co.za" }),
    ).toHaveAttribute("href", "mailto:hello@crownandblade.co.za");
  });

  it("lists weekday hours, Sunday closure and public holidays", () => {
    renderAt("/contact");

    const details = contactDetails();
    expect(
      within(details).getByText("Monday–Saturday: 08:00–17:00"),
    ).toBeInTheDocument();
    expect(within(details).getByText("Sunday: Closed")).toBeInTheDocument();
    expect(
      within(details).getByText(
        "Public holidays: Open Monday–Saturday, 08:00–17:00",
      ),
    ).toBeInTheDocument();
  });

  it("keeps visit details free of a form, map or booking dialog", () => {
    renderAt("/contact");

    expect(document.querySelector("form, iframe")).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("marks Contact as active and sends Book Now to services", async () => {
    const user = userEvent.setup();
    renderAt("/contact");

    screen.getAllByRole("link", { name: "Contact" }).forEach((link) => {
      expect(link).toHaveAttribute("aria-current", "page");
    });
    screen.getAllByRole("link", { name: "Home" }).forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });

    const bookNow = screen.getAllByRole("link", { name: "Book Now" })[0];
    expect(bookNow).toHaveAttribute("href", "/services");
    await user.click(bookNow);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Services built around the detail.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends View Services to the services page without a booking dialog", async () => {
    const user = userEvent.setup();
    renderAt("/contact");

    const viewServices = screen.getByRole("link", { name: "View Services" });
    expect(viewServices).toHaveAttribute("href", "/services");
    await user.click(viewServices);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Services built around the detail.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("reuses the shared footer with the Cape Town address", () => {
    renderAt("/contact");

    expect(
      screen.getByText("© 2026 Crown and Blade. All rights reserved."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("42 Kloof Street").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Gardens, Cape Town").length).toBeGreaterThan(1);
  });
});
