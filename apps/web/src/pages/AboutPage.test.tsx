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

const storyLead =
  "Crown & Blade is a space for people who value the details. We focus on precise work, consistent finishes and an experience that respects your time.";

const storyBody =
  "Based in Gardens, Cape Town, the shop brings together sharp craft, calm confidence and a modern approach to grooming. No shortcuts, no unnecessary noise, just work that looks right from every angle.";

const standards = [
  {
    title: "Detail over shortcuts",
    detail: "Every line, fade and finish is handled with purpose.",
  },
  {
    title: "Consistency in every chair",
    detail: "The standard stays high, no matter which service you choose.",
  },
  {
    title: "A space that respects your time",
    detail: "A calm, focused experience from the moment you arrive.",
  },
] as const;

const aboutImages = [
  {
    alt: "Crown and Blade shop interior with barber chairs, mirrors and daylight over Cape Town",
  },
  {
    alt: "Barber cutting hair with scissors and a comb at Crown and Blade",
  },
  {
    alt: "Client in the chair with a finished cut and beard at Crown and Blade",
  },
] as const;

describe("about page", () => {
  it("sets the About document title", () => {
    renderAt("/about");

    expect(document.title).toBe("About | Crown and Blade");
  });

  it("presents the standard, story, three standards and Cape Town close", () => {
    renderAt("/about");

    expect(screen.getByText("OUR STANDARD")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Good work speaks for itself.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Crown & Blade is built around discipline, detail and a standard you can feel in every finish.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: storyLead }),
    ).toBeInTheDocument();
    expect(screen.getByText(storyBody)).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Three standards." }),
    ).toBeInTheDocument();
    standards.forEach((standard) => {
      expect(
        screen.getByRole("heading", { level: 3, name: standard.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(standard.detail)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Built for the detail, in the heart of Cape Town.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("42 Kloof Street, Gardens, Cape Town"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("© 2026 Crown and Blade. All rights reserved."),
    ).toBeInTheDocument();
  });

  it("shows the shop, the work and the finish as one set of photographs", () => {
    renderAt("/about");

    const images = within(screen.getByRole("main")).getAllByRole("img");

    expect(images).toHaveLength(aboutImages.length);
    images.forEach((image, index) => {
      expect(image).toHaveAttribute("alt", aboutImages[index].alt);
      expect(image.className).toContain("object-cover");
    });
  });

  it("marks About as active and sends Book Now and View Services to the services page", async () => {
    const user = userEvent.setup();
    renderAt("/about");

    screen.getAllByRole("link", { name: "About" }).forEach((link) => {
      expect(link).toHaveAttribute("aria-current", "page");
    });
    screen.getAllByRole("link", { name: "Home" }).forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });

    const viewServices = screen.getByRole("link", { name: "View Services" });
    expect(viewServices).toHaveAttribute("href", "/services");

    screen.getAllByRole("link", { name: "Book Now" }).forEach((link) => {
      expect(link).toHaveAttribute("href", "/services");
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("link", { name: "Book Now" })[0]);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Services built around the detail.",
      }),
    ).toBeInTheDocument();
  });

  it("opens the services page from View Services without a booking dialog", async () => {
    const user = userEvent.setup();
    renderAt("/about");

    await user.click(screen.getByRole("link", { name: "View Services" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Services built around the detail.",
      }),
    ).toBeInTheDocument();
  });
});
