import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar, { NAV_LINKS } from "../src/components/Navbar";

const renderNav = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );

describe("Navbar", () => {
  it("exposes the four destinations as real routes", () => {
    expect(NAV_LINKS.map((l) => l.label)).toEqual(["Projects", "Blog", "Skills", "Contact"]);

    for (const link of NAV_LINKS) {
      expect(link.to).toMatch(/^\//);
      // Anchors to sections that no longer exist would silently do nothing.
      expect(link.to).not.toContain("#");
    }
  });

  it("renders the brand and every nav link", () => {
    renderNav();

    // Brand appears in the bar and again in the mobile overlay.
    expect(screen.getAllByText("Gokulkrishna").length).toBeGreaterThanOrEqual(1);

    for (const link of NAV_LINKS) {
      const matches = screen.getAllByRole("link", { name: link.label });
      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(matches[0]).toHaveAttribute("href", link.to);
    }
  });

  it("points every Get in Touch call to the contact page", () => {
    renderNav();

    for (const cta of screen.getAllByRole("link", { name: /get in touch/i })) {
      expect(cta).toHaveAttribute("href", "/contact");
    }
  });

  it("keeps the mobile overlay hidden until the menu is opened", () => {
    const { container } = renderNav();
    const panel = container.querySelector(".fixed.inset-0");

    expect(panel).toHaveClass("invisible", "opacity-0");
    expect(panel).not.toHaveClass("visible");
  });

  it("opens the overlay from the hamburger and closes it from the X", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();
    const panel = container.querySelector(".fixed.inset-0");

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(panel).toHaveClass("visible", "opacity-100");

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(panel).toHaveClass("invisible", "opacity-0");
  });

  it("closes the overlay when a destination is chosen", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();
    const panel = container.querySelector(".fixed.inset-0");

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(panel).toHaveClass("visible");

    // The overlay copy of a link is the last match in the DOM.
    const projectLinks = within(panel).getByRole("link", { name: "Projects" });
    await user.click(projectLinks);

    expect(panel).toHaveClass("invisible");
  });

  it("closes the overlay when its Get in Touch is used", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();
    const panel = container.querySelector(".fixed.inset-0");

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.click(within(panel).getByRole("link", { name: /get in touch/i }));

    expect(panel).toHaveClass("invisible");
  });

  it("staggers the overlay items so they animate in sequence", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();
    const panel = container.querySelector(".fixed.inset-0");

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const delays = within(panel)
      .getAllByRole("link")
      .map((el) => parseInt(el.style.transitionDelay, 10));

    expect(delays).toEqual([100, 180, 260, 340, 420]);
    expect(within(panel).getAllByRole("link")[0].style.opacity).toBe("1");
  });
});
