import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureDiagram from "../src/components/ArchitectureDiagram";

const NODE_COUNT = 10;

const svgNodes = () => screen.getAllByRole("button").filter((el) => el.tagName === "g");
const node = (name) => svgNodes().find((g) => g.getAttribute("aria-label").startsWith(name));
const detail = () => document.querySelector("aside > div");

describe("ArchitectureDiagram", () => {
  it("draws every component of the platform", () => {
    render(<ArchitectureDiagram />);
    expect(svgNodes()).toHaveLength(NODE_COUNT);

    for (const label of [
      "Users",
      "Nginx",
      "APISIX",
      "GitHub Actions",
      "Core Services",
      "AI / ML Services",
      "Workers",
      "PostgreSQL",
      "Prometheus",
      "Grafana",
    ]) {
      expect(node(label)).toBeTruthy();
    }
  });

  it("no longer includes the removed Cassandra node", () => {
    render(<ArchitectureDiagram />);
    expect(document.body.textContent).not.toContain("Cassandra");
  });

  it("never overlaps two nodes", () => {
    const { container } = render(<ArchitectureDiagram />);
    const boxes = [...container.querySelectorAll("g rect")].map((r) => ({
      x: +r.getAttribute("x"),
      y: +r.getAttribute("y"),
      w: +r.getAttribute("width"),
      h: +r.getAttribute("height"),
    }));

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const overlaps = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        expect(overlaps).toBe(false);
      }
    }
  });

  it("keeps every node inside the viewBox", () => {
    const { container } = render(<ArchitectureDiagram />);
    const [, , vw, vh] = container.querySelector("svg").getAttribute("viewBox").split(" ").map(Number);

    for (const r of container.querySelectorAll("g rect")) {
      expect(+r.getAttribute("x")).toBeGreaterThanOrEqual(0);
      expect(+r.getAttribute("y")).toBeGreaterThanOrEqual(0);
      expect(+r.getAttribute("x") + +r.getAttribute("width")).toBeLessThanOrEqual(vw);
      expect(+r.getAttribute("y") + +r.getAttribute("height")).toBeLessThanOrEqual(vh);
    }
  });

  it("opens on the gateway, the most interesting decision in the stack", () => {
    render(<ArchitectureDiagram />);

    expect(within(detail()).getByRole("heading")).toHaveTextContent("APISIX");
    expect(node("APISIX")).toHaveAttribute("aria-pressed", "true");
    // APISIX is the third node declared, and the counter reflects position.
    expect(detail().textContent).toMatch(/3 of 10 components/i);
  });

  it("explains a node when it is selected", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    await user.click(node("GitHub Actions"));

    expect(within(detail()).getByRole("heading")).toHaveTextContent("GitHub Actions");
    expect(within(detail()).getByText(/every commit builds, tests, scans/i)).toBeInTheDocument();
    expect(within(detail()).getByText(/helm packages each release/i)).toBeInTheDocument();
    expect(node("GitHub Actions")).toHaveAttribute("aria-pressed", "true");
    expect(node("APISIX")).toHaveAttribute("aria-pressed", "false");
  });

  it("renders the slash in AI / ML in a font that can draw it", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    await user.click(node("AI / ML Services"));
    const heading = within(detail()).getByRole("heading");

    expect(heading).toHaveTextContent("AI / ML Services");
    expect(within(heading).getByText("/")).toHaveClass("font-inter");
  });

  it("is operable from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    node("Prometheus").focus();
    await user.keyboard("{Enter}");
    expect(within(detail()).getByRole("heading")).toHaveTextContent("Prometheus");

    node("Workers").focus();
    await user.keyboard(" ");
    expect(within(detail()).getByRole("heading")).toHaveTextContent("Workers");
  });

  it("ignores keys that are not activation keys", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    node("Workers").focus();
    await user.keyboard("{ArrowRight}");

    expect(within(detail()).getByRole("heading")).toHaveTextContent("APISIX");
  });

  it("highlights the edges touching the selected node", async () => {
    const user = userEvent.setup();
    const { container } = render(<ArchitectureDiagram />);

    const lit = () =>
      [...container.querySelectorAll("path")].filter((p) => p.getAttribute("stroke") === "#2563eb");

    // APISIX is selected by default: users->gateway, gateway->3 services, cicd->gateway.
    expect(lit().length).toBe(5);

    await user.click(node("PostgreSQL"));
    expect(lit().length).toBe(2); // core->postgres and ml->postgres
  });

  it("offers the same nodes as a tappable list on mobile", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    const mobileButtons = screen.getAllByRole("button").filter((el) => el.tagName === "BUTTON");
    expect(mobileButtons).toHaveLength(NODE_COUNT);

    await user.click(mobileButtons.find((b) => b.textContent.startsWith("Grafana")));
    expect(within(detail()).getByRole("heading")).toHaveTextContent("Grafana");
  });

  it("groups the mobile list by tier", () => {
    render(<ArchitectureDiagram />);

    for (const tier of ["Entry", "Edge", "Compute", "Data", "Delivery", "Observability"]) {
      expect(screen.getByText(tier)).toBeInTheDocument();
    }
  });

  it("shows tech chips only for nodes that have them", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    await user.click(node("GitHub Actions"));
    expect(within(detail()).getByText("Helm")).toBeInTheDocument();

    // Users and PostgreSQL carry no tech chips.
    await user.click(node("Users"));
    expect(within(detail()).queryByText("Helm")).not.toBeInTheDocument();
  });
});
