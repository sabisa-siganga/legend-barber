import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { shopDetails } from "../lib/shopDetails";

const renderAt = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
};

const termsArticle = () => screen.getByRole("article");

const sectionTitles = [
  "Booking services",
  "Booking confirmation",
  "Availability and booking times",
  "Late arrivals",
  "Cancellations and changes",
  "No-shows",
  "Prices",
  "Customer information",
  "Skin sensitivities and allergies",
  "Changes to these terms",
  "Contact",
] as const;

describe("terms page", () => {
  it("sets the terms document title and meta description", () => {
    renderAt("/terms");

    expect(document.title).toBe("Terms & Conditions | Crown & Blade");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Read Crown & Blade booking, cancellation, pricing and customer information terms.",
    );
  });

  it("introduces the terms under a legal breadcrumb", () => {
    renderAt("/terms");

    const article = termsArticle();
    expect(
      within(article).getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveTextContent("Crown & Blade / Legal");
    expect(
      within(article).getByRole("heading", {
        level: 1,
        name: "Terms & Conditions",
      }),
    ).toBeInTheDocument();
    expect(
      within(article).getByText(
        "These terms explain how bookings at Crown & Blade work and what you can expect when you visit us.",
      ),
    ).toBeInTheDocument();
    expect(
      within(article).getByText("25 September 2026").closest("time"),
    ).toHaveAttribute("datetime", "2026-09-25");
  });

  it("lists every terms section in the page index and the article", () => {
    renderAt("/terms");

    const index = screen.getByRole("navigation", { name: "Terms sections" });
    expect(index.className).toContain("lg:sticky");
    expect(index.className.split(/\s+/).includes("sticky")).toBe(false);

    const article = termsArticle();
    sectionTitles.forEach((title) => {
      expect(
        within(index).getByRole("link", { name: new RegExp(title) }),
      ).toHaveAttribute("href", expect.stringMatching(/^#/));
      expect(
        within(article).getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    });
  });

  it("explains booking, confirmation, lateness and cancellation rules", () => {
    renderAt("/terms");

    const article = termsArticle();
    expect(
      within(article).getByRole("link", { name: "Services page" }),
    ).toHaveAttribute("href", "/services");
    expect(
      within(article).getByText(/one 30-minute time slot/i),
    ).toBeInTheDocument();
    expect(
      within(article).getByText(/does not offer barber selection/i),
    ).toBeInTheDocument();
    expect(
      within(article).getByText(/does not send booking confirmation emails/i),
    ).toBeInTheDocument();
    expect(
      within(article).getByText(/not reserved until the booking is successfully confirmed/i),
    ).toBeInTheDocument();
    expect(within(article).getByText("10 minutes late")).toBeInTheDocument();
    expect(within(article).getByText("2 hours before")).toBeInTheDocument();
    expect(
      within(article).getByText(/does not include online cancellation or rescheduling/i),
    ).toBeInTheDocument();
  });

  it("shows the shared phone, email and Gardens address for contact", () => {
    renderAt("/terms");

    const article = termsArticle();
    const phoneLinks = within(article).getAllByRole("link", {
      name: shopDetails.phoneDisplay,
    });
    phoneLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", shopDetails.phoneHref);
    });
    expect(
      within(article).getByRole("link", { name: shopDetails.email }),
    ).toHaveAttribute("href", shopDetails.emailHref);
    expect(
      within(article).getByRole("link", { name: "Contact page" }),
    ).toHaveAttribute("href", "/contact");

    const address = within(article)
      .getByText(shopDetails.addressLine1)
      .closest("address");
    expect(address).not.toBeNull();
    expect(address).toHaveTextContent("Crown & Blade");
    expect(address).toHaveTextContent(shopDetails.addressLine2);
  });

  it("routes the footer terms link and the back-to-services action", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(
      screen.getByRole("link", { name: "Terms & Conditions" }),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Terms & Conditions" }),
    ).toBeInTheDocument();

    const backToServices = within(termsArticle()).getByRole("link", {
      name: "Back to Services",
    });
    expect(backToServices).toHaveAttribute("href", "/services");
    await user.click(backToServices);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Services built around the detail.",
      }),
    ).toBeInTheDocument();
  });

  it("keeps legacy shop names and cities out of the terms", () => {
    renderAt("/terms");

    const text = termsArticle().textContent ?? "";
    expect(text).not.toMatch(/Legend Barber/i);
    expect(text).not.toMatch(/Sandton/i);
    expect(text).not.toMatch(/Johannesburg/i);
    expect(text).not.toMatch(/\+27 11/);
  });
});
