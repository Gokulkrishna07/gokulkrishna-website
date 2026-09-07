import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PodiumText from "../src/components/PodiumText";

// The PODIUM display face is a demo release that renders a "DEMO" watermark for
// & - / and +, so those characters must be split out and rendered in Inter.
const inter = (container) =>
  [...container.querySelectorAll("span.font-inter")].map((el) => el.textContent);

describe("PodiumText", () => {
  it("renders plain text untouched when it has no broken glyphs", () => {
    const { container } = render(
      <span>
        <PodiumText>Kubernetes</PodiumText>
      </span>,
    );

    expect(container.textContent).toBe("Kubernetes");
    expect(inter(container)).toEqual([]);
  });

  it.each([
    ["AI / ML Services", "/"],
    ["Cloud & DevOps", "&"],
    ["On-prem", "-"],
    ["2+", "+"],
  ])("isolates the broken glyph in %s", (input, glyph) => {
    const { container } = render(
      <span>
        <PodiumText>{input}</PodiumText>
      </span>,
    );

    expect(container.textContent).toBe(input);
    expect(inter(container)).toEqual([glyph]);
  });

  it("isolates every broken glyph when several appear", () => {
    const { container } = render(
      <span>
        <PodiumText>{"A&B-C/D+E"}</PodiumText>
      </span>,
    );

    expect(container.textContent).toBe("A&B-C/D+E");
    expect(inter(container)).toEqual(["&", "-", "/", "+"]);
  });

  it("coerces non-string children to a string", () => {
    render(
      <span data-testid="numeric">
        <PodiumText>{2026}</PodiumText>
      </span>,
    );

    expect(screen.getByTestId("numeric")).toHaveTextContent("2026");
  });

  it("keeps the glyph spans bold so they optically match the display face", () => {
    const { container } = render(
      <span>
        <PodiumText>2+</PodiumText>
      </span>,
    );

    expect(container.querySelector("span.font-inter")).toHaveClass("font-bold");
  });
});
