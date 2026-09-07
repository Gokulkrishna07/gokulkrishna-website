import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// The live site has no drafts, but the listing must still handle them: a draft
// is an announced topic, not a link to an empty page.
vi.mock("../src/data/posts", () => ({
  POSTS: [
    {
      slug: "published-one",
      title: "A published piece",
      summary: "This one is finished.",
      tags: ["Kubernetes"],
      status: "published",
      date: "1 Jan 2026",
      content: [{ type: "p", text: "body" }],
    },
    {
      slug: "draft-one",
      title: "A drafted piece",
      summary: "This one is not written yet.",
      tags: ["Terraform"],
      status: "draft",
      date: null,
      content: [],
    },
  ],
  getPost: vi.fn(),
}));

const { default: Blog } = await import("../src/pages/Blog");

describe("Blog listing with drafts", () => {
  it("labels a draft as coming soon instead of showing a date", () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>,
    );

    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByText("1 Jan 2026")).toBeInTheDocument();
  });

  it("does not link a draft, so nobody lands on an empty article", () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /a published piece/i })).toHaveAttribute(
      "href",
      "/blog/published-one",
    );
    expect(screen.queryByRole("link", { name: /a drafted piece/i })).not.toBeInTheDocument();
    expect(screen.getByText("A drafted piece")).toBeInTheDocument();
  });

  it("still features the first post even when it is a draft", () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>,
    );

    expect(screen.getByText(/latest/i)).toBeInTheDocument();
  });
});
