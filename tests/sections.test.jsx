import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import TechMarquee from "../src/components/TechMarquee";
import ExperienceSection from "../src/components/ExperienceSection";

describe("TechMarquee", () => {
  it("duplicates the stack so the loop has no visible seam", () => {
    const { container } = render(<TechMarquee />);
    const items = [...container.querySelectorAll(".animate-marquee > span")];

    expect(items.length % 2).toBe(0);

    const half = items.length / 2;
    const first = items.slice(0, half).map((el) => el.textContent);
    const second = items.slice(half).map((el) => el.textContent);
    expect(first).toEqual(second);
  });

  it("names the tools he actually works with", () => {
    render(<TechMarquee />);

    for (const tool of ["Kubernetes", "Docker", "Terraform", "Prometheus", "Grafana"]) {
      expect(screen.getAllByText(tool).length).toBe(2);
    }
  });

  it("animates, and the track is wide enough to scroll", () => {
    const { container } = render(<TechMarquee />);
    const track = container.querySelector(".animate-marquee");

    expect(track).toBeInTheDocument();
    expect(track).toHaveClass("w-max");
  });
});

describe("ExperienceSection", () => {
  it("anchors itself so the nav can reach it", () => {
    const { container } = render(<ExperienceSection />);
    expect(container.querySelector("#experience")).toBeInTheDocument();
  });

  it("states the current role and employer", () => {
    render(<ExperienceSection />);

    expect(screen.getByText("Edstem Technologies")).toBeInTheDocument();
    expect(screen.getByText("Junior Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Nov 2024 — Present")).toBeInTheDocument();
  });

  it("lists what he actually did, not a job description", () => {
    render(<ExperienceSection />);

    expect(screen.getByText(/DigitalOcean Kubernetes/)).toBeInTheDocument();
    expect(screen.getByText(/Proxmox to AWS using Terraform/)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Actions pipelines/)).toBeInTheDocument();
  });

  it("shows the degree", () => {
    render(<ExperienceSection />);

    expect(screen.getByText("B.Tech in Computer Science")).toBeInTheDocument();
    expect(screen.getByText(/Kerala Technological University/)).toBeInTheDocument();
    expect(screen.getByText("2020 — 2024")).toBeInTheDocument();
  });

  it("lists every certification with its issuer and date", () => {
    const { container } = render(<ExperienceSection />);

    const heading = screen.getByRole("heading", { name: /certifications/i });
    const grid = heading.parentElement.nextElementSibling;
    expect(grid.children).toHaveLength(8);
    expect(within(heading.parentElement).getByText("8")).toBeInTheDocument();

    expect(screen.getByText("Claude Code in Action")).toBeInTheDocument();
    expect(screen.getByText("Microsoft Azure AI Fundamentals (AI-900)")).toBeInTheDocument();
    expect(screen.getAllByText("Udemy")).toHaveLength(2);

    // Each card carries a date.
    for (const card of grid.children) {
      expect(card.textContent).toMatch(/(19|20)\d{2}/);
    }
    expect(container).toBeTruthy();
  });

  it("marks the role with the red accent rather than plain white", () => {
    const { container } = render(<ExperienceSection />);
    expect(container.querySelector(".border-accent\\/70")).toBeInTheDocument();
  });
});
