import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../src/pages/Home";

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

describe("Home", () => {
  it("plays the hero video muted and looping so autoplay is allowed", () => {
    const { container } = renderHome();
    const video = container.querySelector("video");

    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveClass("object-cover");
  });

  it("leads with the role and the three word statement", () => {
    renderHome();

    expect(screen.getByText(/cloud & devops engineer/i)).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Deploy.");
    expect(heading).toHaveTextContent("Automate.");
    expect(heading).toHaveTextContent("Scale.");
  });

  it("shows the three headline numbers", () => {
    renderHome();

    expect(screen.getByText("2+")).toBeInTheDocument();
    expect(screen.getByText("6+")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
  });

  it("no longer claims a certified cloud engineer badge", () => {
    renderHome();
    expect(document.body.textContent).not.toMatch(/certified\s*cloud engineer/i);
  });

  it("sends the primary call to action to the projects page", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /view my work/i })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("orders the page so the architecture is read before the pipeline", () => {
    renderHome();

    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    const architecture = headings.findIndex((t) => /the architecture/i.test(t));
    const pipeline = headings.findIndex((t) => /run my pipeline/i.test(t));

    expect(architecture).toBeGreaterThan(-1);
    expect(pipeline).toBeGreaterThan(architecture);
  });

  it("assembles every section of the page", () => {
    const { container } = renderHome();

    expect(container.querySelector("#about")).toBeInTheDocument();
    expect(container.querySelector("#experience")).toBeInTheDocument();
    expect(container.querySelector(".animate-marquee")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /run my pipeline/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /the architecture/i })).toBeInTheDocument();
  });

  it("closes with a call to action pointing at contact", () => {
    renderHome();

    expect(screen.getByText(/open to work/i)).toBeInTheDocument();
    const cta = screen.getAllByRole("link", { name: /get in touch/i });
    expect(cta[cta.length - 1]).toHaveAttribute("href", "/contact");
  });
});
