import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const track = vi.fn();
const trackPageView = vi.fn();
const initAnalytics = vi.fn();

vi.mock("../src/lib/analytics", () => ({
  track,
  trackPageView,
  initAnalytics,
  isEnabled: () => true,
  resetAnalytics: vi.fn(),
}));

const { default: App } = await import("../src/App");
const { default: ChatWidget } = await import("../src/components/ChatWidget");
const { default: ArchitectureDiagram } = await import("../src/components/ArchitectureDiagram");
const { default: Contact } = await import("../src/pages/Contact");
const { default: BlogPost } = await import("../src/pages/BlogPost");
const { POSTS } = await import("../src/data/posts");

const names = () => track.mock.calls.map(([name]) => name);
const propsFor = (name) => track.mock.calls.find(([n]) => n === name)?.[1];

describe("analytics wiring", () => {
  beforeEach(() => {
    track.mockClear();
    trackPageView.mockClear();
    initAnalytics.mockClear();
    globalThis.fetch = vi.fn();
  });

  it("initialises once and records a page view per route", async () => {
    window.history.pushState({}, "", "/skills");
    render(<App />);

    await waitFor(() => expect(initAnalytics).toHaveBeenCalledTimes(1));
    expect(trackPageView).toHaveBeenCalledWith("/skills");
  });

  it("records a page view again when the route changes", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/");
    render(<App />);

    trackPageView.mockClear();
    await user.click(screen.getAllByRole("link", { name: "Contact" })[0]);

    await waitFor(() => expect(trackPageView).toHaveBeenCalledWith("/contact"));
  });

  it("records chat open, question and reply", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => ({ data: { response: "hi" } }) });
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: /ask about gokulkrishna/i }));
    expect(names()).toContain("Chat Opened");

    await user.type(screen.getByLabelText(/your question/i), "Who are you?{Enter}");
    await screen.findByText("hi");

    expect(propsFor("Chat Question Asked")).toMatchObject({ source: "input" });
    expect(propsFor("Chat Reply Received")).toMatchObject({ ok: true, answered: true });

    await user.click(screen.getByRole("button", { name: /close chat/i }));
    expect(names()).toContain("Chat Closed");
  });

  it("distinguishes a starter question from a typed one", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => ({ data: { response: "x" } }) });
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: /ask about gokulkrishna/i }));
    await user.click(screen.getByRole("button", { name: /how do i get in touch/i }));

    expect(propsFor("Chat Question Asked")).toMatchObject({ source: "suggestion" });
  });

  it("records a chat failure when the network is down", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockRejectedValue(new Error("offline"));
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: /ask about gokulkrishna/i }));
    await user.type(screen.getByLabelText(/your question/i), "Hi{Enter}");
    await screen.findByText(/could not reach the server/i);

    expect(propsFor("Chat Failed")).toMatchObject({ reason: "network" });
  });

  it("records which architecture node was explored, and from where", async () => {
    const user = userEvent.setup();
    render(<ArchitectureDiagram />);

    const diagramNode = screen
      .getAllByRole("button")
      .find((el) => el.tagName === "g" && el.getAttribute("aria-label").startsWith("Prometheus"));
    await user.click(diagramNode);
    expect(propsFor("Architecture Node Selected")).toMatchObject({
      node: "observability",
      surface: "diagram",
    });

    track.mockClear();
    const listNode = screen
      .getAllByRole("button")
      .find((el) => el.tagName === "BUTTON" && el.textContent.startsWith("Grafana"));
    await user.click(listNode);
    expect(propsFor("Architecture Node Selected")).toMatchObject({ surface: "list" });
  });

  it("records which contact channel was used", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );

    await user.click(screen.getAllByRole("link", { name: /gokulkrishnaab7@gmail\.com/ })[0]);
    expect(propsFor("Contact Channel Used")).toMatchObject({ channel: "Email" });
  });

  it("records a blog read and a click through to the original", async () => {
    const user = userEvent.setup();
    const post = POSTS[0];

    render(
      <MemoryRouter initialEntries={[`/blog/${post.slug}`]}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(propsFor("Blog Post Read")).toMatchObject({ slug: post.slug }));

    await user.click(screen.getByRole("link", { name: /originally posted on linkedin/i }));
    expect(propsFor("Blog Source Opened")).toMatchObject({ slug: post.slug });
  });
});
