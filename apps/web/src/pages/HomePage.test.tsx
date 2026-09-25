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

describe("homepage", () => {
  it("sets the Crown and Blade document title", () => {
    renderAt("/");

    expect(document.title).toBe("Crown and Blade | Cape Town Barber Shop");
  });

  it("shows the hero, brand statement, services, craft and visit copy", () => {
    renderAt("/");

    expect(
      screen.getByRole("heading", { level: 1, name: "Built for the detail." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Precision cuts. Clean finishes. No shortcuts."),
    ).toBeInTheDocument();
    expect(screen.getByText("GARDENS, CAPE TOWN")).toBeInTheDocument();
    expect(screen.getByText("Mon–Sat · 08:00–17:00")).toBeInTheDocument();
    expect(
      screen.getByText(/Crown and Blade is a space for sharp work/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The work, done properly." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Signature Cut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Skin Fade" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cut + Beard Detail" }),
    ).toBeInTheDocument();
    expect(screen.getByText("R220 · 30 min")).toBeInTheDocument();
    expect(screen.getByText("R250 · 30 min")).toBeInTheDocument();
    expect(screen.getByText("R320 · 30 min")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The finish is in the details." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Your chair in Gardens." }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("42 Kloof Street").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+27 21 555 0188").length).toBeGreaterThan(0);
    expect(
      screen.getByText("© 2026 Crown and Blade. All rights reserved."),
    ).toBeInTheDocument();
  });

  it("sends booking and service actions to the services page", () => {
    renderAt("/");

    const serviceHrefs = [
      "Explore Services",
      "View all services →",
      "See our services →",
      "View services and book",
    ];

    serviceHrefs.forEach((name) => {
      expect(screen.getByRole("link", { name })).toHaveAttribute(
        "href",
        "/services",
      );
    });

    screen.getAllByRole("link", { name: "Book Now" }).forEach((link) => {
      expect(link).toHaveAttribute("href", "/services");
    });

    screen.getAllByRole("link", { name: /Signature Cut/ }).forEach((link) => {
      expect(link).toHaveAttribute("href", "/services");
    });
  });

  it("opens and closes the mobile menu from the keyboard", async () => {
    const user = userEvent.setup();
    renderAt("/");

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const menus = screen.getAllByRole("navigation", { name: "Primary" });
    const mobileMenu = menus[menus.length - 1];
    expect(
      within(mobileMenu).getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("href", "/contact");

    await user.keyboard("{Escape}");

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();
  });

  it("links the footer to terms", () => {
    renderAt("/");

    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
  });

  it("keeps the services placeholder route", () => {
    renderAt("/services");

    expect(
      screen.getByRole("heading", { name: "Services" }),
    ).toBeInTheDocument();
  });
});
