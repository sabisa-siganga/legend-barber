import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";

const menu = [
  {
    name: "Signature Cut",
    price: "R220",
    description:
      "A tailored cut with a clean finish, shaped to suit your look.",
    alt: "Barber cutting hair with scissors for a signature cut",
  },
  {
    name: "Skin Fade",
    price: "R250",
    description:
      "Sharp blending, precise tapering and a finish that stays clean.",
    alt: "Barber blending a skin fade with clippers",
  },
  {
    name: "Cut + Beard Detail",
    price: "R320",
    description: "A complete reset with a tailored cut and refined beard work.",
    alt: "Barber detailing a beard along the jawline",
  },
  {
    name: "Beard Shape-Up",
    price: "R150",
    description: "Clean lines, balanced shape and detail where it matters.",
    alt: "Barber shaping the cheek line of a beard",
  },
  {
    name: "Kids Cut",
    price: "R160",
    description:
      "A neat, comfortable cut with a sharp finish for younger clients.",
    alt: "Barber clipping a child's hair in the chair",
  },
  {
    name: "Line-Up & Edge Detail",
    price: "R120",
    description: "Crisp hairline work to bring definition back to your look.",
    alt: "Barber defining a hairline with a trimmer",
  },
] as const;

const renderAt = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
};

describe("services page", () => {
  it("renders all six services with price, description and image", () => {
    renderAt("/services");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Services built around the detail.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("THE MENU")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Crown & Blade delivers precise cuts, clean finishes and grooming built around the detail.",
      ),
    ).toBeInTheDocument();

    menu.forEach((service) => {
      const article = screen.getByRole("article", { name: service.name });
      expect(
        within(article).getByRole("heading", { name: service.name }),
      ).toBeInTheDocument();
      expect(within(article).getByText(service.price)).toBeInTheDocument();
      expect(
        within(article).getByText(service.description),
      ).toBeInTheDocument();
      const image = within(article).getByRole("img");
      expect(image).toHaveAttribute("alt", service.alt);
      expect(image.className).toContain("object-cover");
      expect(
        within(article).getByRole("button", { name: /Book this service/ }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", {
        name: "Your next clean finish starts at Crown & Blade.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("42 Kloof Street, Gardens, Cape Town"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Choose a service above" }),
    ).toHaveAttribute("href", "#service-list");
  });

  it("marks Services as active and keeps Book Now on the services page", async () => {
    const user = userEvent.setup();
    renderAt("/services");

    screen.getAllByRole("link", { name: "Services" }).forEach((link) => {
      expect(link).toHaveAttribute("aria-current", "page");
    });
    screen.getAllByRole("link", { name: "Home" }).forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });

    const bookNow = screen.getAllByRole("link", { name: "Book Now" })[0];
    expect(bookNow).toHaveAttribute("href", "/services");
    await user.click(bookNow);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends the selected service to the booking handler and keeps it fixed", async () => {
    const user = userEvent.setup();
    renderAt("/services");

    const skinFade = screen.getByRole("article", { name: "Skin Fade" });
    const listingImage = within(skinFade).getByRole("img");
    await user.click(
      within(skinFade).getByRole("button", { name: /Book this service/ }),
    );

    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Skin Fade" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("R250")).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        "Sharp blending, precise tapering and a finish that stays clean.",
      ),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      listingImage.getAttribute("src"),
    );
    expect(
      within(dialog).getByText("This service stays fixed for this booking."),
    ).toBeInTheDocument();
    expect(dialog.querySelector("select")).toBeNull();
    expect(within(dialog).queryByLabelText(/barber/i)).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Confirm booking" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        "Time availability will load once a date is selected.",
      ),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      within(skinFade).getByRole("button", { name: /Book this service/ }),
    ).toHaveFocus();

    const lineUp = screen.getByRole("article", {
      name: "Line-Up & Edge Detail",
    });
    await user.click(
      within(lineUp).getByRole("button", { name: /Book this service/ }),
    );

    const nextDialog = screen.getByRole("dialog");
    expect(
      within(nextDialog).getByRole("heading", {
        name: "Line-Up & Edge Detail",
      }),
    ).toBeInTheDocument();
    expect(within(nextDialog).getByText("R120")).toBeInTheDocument();
    expect(
      within(nextDialog).getByText(
        "Crisp hairline work to bring definition back to your look.",
      ),
    ).toBeInTheDocument();
    expect(
      within(nextDialog).queryByRole("heading", { name: "Skin Fade" }),
    ).not.toBeInTheDocument();

    await user.click(within(nextDialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
