import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AboutSection from "../src/components/AboutSection";

const renderAbout = () =>
  render(
    <MemoryRouter>
      <AboutSection />
    </MemoryRouter>,
  );

const rail = (container) => container.querySelector(".scrollbar-none");

// jsdom has no layout, so give the rail believable scroll geometry.
function sizeRail(el, { scrollWidth = 3000, clientWidth = 1000 } = {}) {
  Object.defineProperty(el, "scrollWidth", { value: scrollWidth, configurable: true });
  Object.defineProperty(el, "clientWidth", { value: clientWidth, configurable: true });
  el.scrollLeft = 0;
}

describe("AboutSection", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((cb) => {
      cb(performance.now() + 10_000); // jump past the tween duration
      return 1;
    });
    vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {});
  });

  it("introduces him by name with the bio", () => {
    renderAbout();

    expect(screen.getByText("Gokulkrishna")).toBeInTheDocument();
    expect(screen.getByText(/infrastructure that stays up/i)).toBeInTheDocument();
    // "boring" reads as self-deprecating to a non-engineer and was removed.
    expect(document.body.textContent).not.toMatch(/infrastructure boring/i);
  });

  it("links the bio through to the contact page", () => {
    renderAbout();
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
  });

  it("renders every photo with descriptive alt text", () => {
    renderAbout();
    const images = screen.getAllByRole("img");

    expect(images.length).toBeGreaterThanOrEqual(8);
    for (const img of images) {
      expect(img).toHaveAttribute("alt", expect.stringMatching(/\S/));
      expect(img).toHaveAttribute("decoding", "async");
      // Lazy loading never fires inside this horizontal container.
      expect(img).not.toHaveAttribute("loading", "lazy");
    }
  });

  it("shows the map card with its attribution and marker", () => {
    renderAbout();

    expect(screen.getByAltText(/map of ernakulam/i)).toBeInTheDocument();
    expect(screen.getByText(/ernakulam, kerala/i)).toBeInTheDocument();
    expect(screen.getByText(/openstreetmap contributors/i)).toBeInTheDocument();
  });

  it("falls back to a labelled placeholder when a photo is missing", async () => {
    renderAbout();
    const ride = screen.getByAltText(/beside his motorcycle/i);

    fireEvent.error(ride);

    expect(await screen.findByText("ride.jpg")).toBeInTheDocument();
    expect(screen.queryByAltText(/beside his motorcycle/i)).not.toBeInTheDocument();
  });

  it("advances the rail with the next control and rewinds with previous", async () => {
    const user = userEvent.setup();
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    await user.click(screen.getByRole("button", { name: /scroll right/i }));
    expect(el.scrollLeft).toBe(750); // clientWidth * 0.75

    await user.click(screen.getByRole("button", { name: /scroll left/i }));
    expect(el.scrollLeft).toBe(0);
  });

  it("clamps scrolling at both ends of the rail", async () => {
    const user = userEvent.setup();
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    await user.click(screen.getByRole("button", { name: /scroll left/i }));
    expect(el.scrollLeft).toBe(0);

    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByRole("button", { name: /scroll right/i }));
    }
    expect(el.scrollLeft).toBe(2000); // scrollWidth - clientWidth
  });

  it("reports progress as the rail is scrolled", async () => {
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    const bar = container.querySelector(".h-px.bg-white");
    expect(bar.style.width).toBe("6%"); // floor so the bar is always visible

    el.scrollLeft = 2000;
    fireEvent.scroll(el);

    await waitFor(() => expect(bar.style.width).toBe("100%"));
  });

  it("drags the rail with a pointer", () => {
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    fireEvent.pointerDown(el, { pointerId: 1, clientX: 500, pointerType: "mouse" });
    fireEvent.pointerMove(el, { pointerId: 1, clientX: 320, pointerType: "mouse" });
    expect(el.scrollLeft).toBe(180);

    fireEvent.pointerUp(el, { pointerId: 1, pointerType: "mouse" });
    fireEvent.pointerMove(el, { pointerId: 1, clientX: 100, pointerType: "mouse" });
    expect(el.scrollLeft).toBe(180); // no longer dragging
  });

  it("leaves touch scrolling to the browser", () => {
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    fireEvent.pointerDown(el, { pointerId: 2, clientX: 500, pointerType: "touch" });
    fireEvent.pointerMove(el, { pointerId: 2, clientX: 100, pointerType: "touch" });

    expect(el.scrollLeft).toBe(0);
  });

  it("stops dragging when the pointer leaves the rail", () => {
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    fireEvent.pointerDown(el, { pointerId: 3, clientX: 400, pointerType: "mouse" });
    fireEvent.pointerLeave(el, { pointerId: 3, pointerType: "mouse" });
    fireEvent.pointerMove(el, { pointerId: 3, clientX: 100, pointerType: "mouse" });

    expect(el.scrollLeft).toBe(0);
  });

  it("cancels any in-flight tween on unmount", () => {
    const { unmount } = renderAbout();
    expect(() => unmount()).not.toThrow();
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
  });
  it("eases the scroll over several frames rather than jumping", async () => {
    // Drive rAF one frame at a time so the tween actually recurses.
    let frame = 0;
    globalThis.requestAnimationFrame.mockImplementation((cb) => {
      frame += 1;
      if (frame <= 12) cb(performance.now() + frame * 60);
      return frame;
    });

    const user = userEvent.setup();
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    await user.click(screen.getByRole("button", { name: /scroll right/i }));

    expect(frame).toBeGreaterThan(1); // more than a single hop
    expect(el.scrollLeft).toBeCloseTo(750, 0);
  });

  it("only releases a pointer it actually captured", () => {
    const { container } = renderAbout();
    const el = rail(container);
    sizeRail(el);

    const release = vi.spyOn(el, "releasePointerCapture");
    vi.spyOn(el, "hasPointerCapture").mockReturnValue(false);

    fireEvent.pointerDown(el, { pointerId: 9, clientX: 300, pointerType: "mouse" });
    fireEvent.pointerUp(el, { pointerId: 9, pointerType: "mouse" });

    expect(release).not.toHaveBeenCalled();
  });
});
