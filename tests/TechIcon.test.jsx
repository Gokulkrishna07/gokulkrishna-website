import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { siHelm, siKubernetes } from "simple-icons";
import TechIcon from "../src/components/TechIcon";

const svg = (container) => container.querySelector("svg");

describe("TechIcon", () => {
  it("renders the real brand mark in its own colour", () => {
    const { container } = render(<TechIcon name="Kubernetes" />);
    const el = svg(container);

    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("viewBox", "0 0 24 24");
    expect(el.getAttribute("fill")).toBe(`#${siKubernetes.hex}`);
    expect(el.querySelector("path")).toHaveAttribute("d", siKubernetes.path);
  });

  it("lifts a brand colour that would be invisible on the dark page", () => {
    // Helm's navy (#0F1689) is far below the luminance threshold.
    const { container } = render(<TechIcon name="Helm" />);
    const fill = svg(container).getAttribute("fill");

    expect(siHelm.hex).toBe("0F1689");
    expect(fill).toMatch(/^rgb\(/);

    const [r, g, b] = fill.match(/\d+/g).map(Number);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    expect(luminance).toBeGreaterThan(0.22);
  });

  it("falls back to a neutral glyph for brands with no mark available", () => {
    // Amazon's marks were withdrawn from simple-icons and APISIX was never added.
    const { container } = render(<TechIcon name="AWS" />);

    expect(svg(container)).toBeInTheDocument();
    expect(svg(container)).toHaveClass("text-white/50");
    expect(svg(container).getAttribute("fill")).not.toMatch(/^#/);
  });

  it.each(["APISIX", "AWS EC2", "CI/CD", "Infrastructure as Code"])(
    "renders a fallback for %s",
    (name) => {
      const { container } = render(<TechIcon name={name} />);
      expect(svg(container)).toBeInTheDocument();
    },
  );

  it("renders nothing for an unknown tag rather than an empty box", () => {
    const { container } = render(<TechIcon name="Totally Unknown Tool" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("applies the default size and honours an override", () => {
    const { container: def } = render(<TechIcon name="Docker" />);
    expect(svg(def)).toHaveClass("h-3.5", "w-3.5", "shrink-0");

    const { container: big } = render(<TechIcon name="Docker" className="h-8 w-8" />);
    expect(svg(big)).toHaveClass("h-8", "w-8");
    expect(svg(big)).not.toHaveClass("h-3.5");
  });

  it("hides decorative icons from assistive tech", () => {
    const { container } = render(<TechIcon name="Grafana" />);
    expect(svg(container)).toHaveAttribute("aria-hidden", "true");
  });
});
