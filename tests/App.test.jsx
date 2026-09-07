import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { PROJECTS } from "../src/data/projects";
import { POSTS } from "../src/data/posts";

const go = (path) => window.history.pushState({}, "", path);

describe("App routing", () => {
  it.each([
    ["/", /deploy\./i],
    ["/projects", /selected work/i],
    ["/skills", /what i work with/i],
    ["/contact", /get in touch/i],
    ["/blog", /notes from production/i],
  ])("renders %s", async (path, marker) => {
    go(path);
    render(<App />);

    expect(await screen.findAllByText(marker)).not.toHaveLength(0);
  });

  it("renders a project detail route", async () => {
    go(`/projects/${PROJECTS[0].slug}`);
    render(<App />);

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(PROJECTS[0].title);
  });

  it("renders a blog post route", async () => {
    go(`/blog/${POSTS[0].slug}`);
    render(<App />);

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(POSTS[0].title);
  });

  it("mounts the chat widget on every page", async () => {
    go("/contact");
    render(<App />);

    expect(
      await screen.findByRole("button", { name: /ask about gokulkrishna/i }),
    ).toBeInTheDocument();
  });

  it("scrolls back to the top when the route changes", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, "scrollTo");

    go("/projects");
    render(<App />);

    scrollTo.mockClear();
    await user.click(screen.getAllByRole("link", { name: /car dealer management platform/i })[0]);

    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 0));
  });

  it("navigates between pages through the nav bar", async () => {
    const user = userEvent.setup();
    go("/");
    render(<App />);

    await user.click(screen.getAllByRole("link", { name: "Skills" })[0]);
    expect(await screen.findByRole("heading", { name: /^skills$/i })).toBeInTheDocument();
  });
});
