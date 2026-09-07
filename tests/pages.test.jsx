import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Projects from "../src/pages/Projects";
import ProjectDetail from "../src/pages/ProjectDetail";
import Skills from "../src/pages/Skills";
import Contact from "../src/pages/Contact";
import Blog from "../src/pages/Blog";
import BlogPost from "../src/pages/BlogPost";
import { PROJECTS } from "../src/data/projects";
import { POSTS } from "../src/data/posts";

const at = (path, element, pattern) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={pattern} element={element} />
        <Route path="/projects" element={<div>projects listing</div>} />
        <Route path="/blog" element={<div>blog listing</div>} />
      </Routes>
    </MemoryRouter>,
  );

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Projects listing", () => {
  it("renders a card per project, each linking to its detail page", () => {
    const { container } = wrap(<Projects />);

    // Query once: a role+regex lookup per project is far too slow under coverage.
    const cards = [...container.querySelectorAll('a[href^="/projects/"]')];
    expect(cards).toHaveLength(PROJECTS.length);

    for (const project of PROJECTS) {
      const card = cards.find((a) => a.getAttribute("href") === `/projects/${project.slug}`);
      expect(card).toBeTruthy();
      expect(card.textContent).toContain(project.title);
      expect(card.textContent).toContain(project.category);
      expect(card.textContent).toContain(project.metric);
    }
  });

  it("numbers the cards and invites a click", () => {
    wrap(<Projects />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getAllByText(/read more/i)).toHaveLength(PROJECTS.length);
  });

  it("says plainly that client names are withheld", () => {
    wrap(<Projects />);
    expect(screen.getByText(/client names are withheld/i)).toBeInTheDocument();
  });
});

describe("Project detail", () => {
  const project = PROJECTS[0];

  it("renders the full write up for a known slug", () => {
    at(`/projects/${project.slug}`, <ProjectDetail />, "/projects/:slug");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(project.title);
    expect(screen.getByText(project.overview)).toBeInTheDocument();
    expect(screen.getByText(project.metric)).toBeInTheDocument();

    for (const item of project.responsibilities) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("numbers the responsibilities", () => {
    at(`/projects/${project.slug}`, <ProjectDetail />, "/projects/:slug");
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("offers the next project, wrapping at the end", () => {
    at(`/projects/${project.slug}`, <ProjectDetail />, "/projects/:slug");
    expect(screen.getByRole("link", { name: /next:/i })).toHaveAttribute(
      "href",
      `/projects/${PROJECTS[1].slug}`,
    );

    const last = PROJECTS[PROJECTS.length - 1];
    at(`/projects/${last.slug}`, <ProjectDetail />, "/projects/:slug");
    expect(screen.getAllByRole("link", { name: /next:/i })[1]).toHaveAttribute(
      "href",
      `/projects/${PROJECTS[0].slug}`,
    );
  });

  it("redirects an unknown slug back to the listing", () => {
    at("/projects/not-a-project", <ProjectDetail />, "/projects/:slug");
    expect(screen.getByText("projects listing")).toBeInTheDocument();
  });
});

describe("Skills", () => {
  it("groups every skill from the resume", () => {
    wrap(<Skills />);

    for (const group of [
      "Cloud Platforms",
      "Containers and Orchestration",
      "IaC and Pipelines",
      "Monitoring and Observability",
      "Networking and API Management",
      "Databases",
      "AI Assisted DevOps",
      "Tools and Practices",
    ]) {
      expect(screen.getByRole("heading", { name: group })).toBeInTheDocument();
    }
  });

  it("keeps CI/CD out of the display font, which cannot draw a slash", () => {
    wrap(<Skills />);

    // The heading is reworded; the full name still appears in the list below it.
    expect(screen.getByRole("heading", { name: "IaC and Pipelines" })).toBeInTheDocument();
    expect(screen.getByText("CI/CD Pipeline Design")).toBeInTheDocument();
  });

  it("lists the individual tools", () => {
    wrap(<Skills />);

    expect(screen.getByText("AWS (EC2, S3, Lambda, API Gateway)")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes (K8s)")).toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
  });
});

describe("Contact", () => {
  it("makes email and phone actionable", () => {
    wrap(<Contact />);

    expect(screen.getAllByRole("link", { name: /gokulkrishnaab7@gmail\.com/ })[0]).toHaveAttribute(
      "href",
      "mailto:gokulkrishnaab7@gmail.com",
    );
    expect(screen.getByRole("link", { name: /\+91 9037363277/ })).toHaveAttribute(
      "href",
      "tel:+919037363277",
    );
  });

  it("opens external profiles in a new tab safely", () => {
    wrap(<Contact />);

    for (const name of [/linkedin\.com/, /github\.com/]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("shows location as plain text, not a dead link", () => {
    wrap(<Contact />);

    const location = screen.getByText("Ernakulam, Kerala, India");
    expect(location.closest("a")).toBeNull();
  });
});

describe("Blog listing", () => {
  it("features the newest post and lists the rest", () => {
    wrap(<Blog />);

    expect(screen.getByText(/latest/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(POSTS[0].title, "i") })).toHaveAttribute(
      "href",
      `/blog/${POSTS[0].slug}`,
    );

    for (const post of POSTS) {
      expect(screen.getByRole("link", { name: new RegExp(post.title, "i") })).toBeInTheDocument();
    }
  });

  it("shows a date for every published post", () => {
    wrap(<Blog />);
    for (const post of POSTS.filter((p) => p.status === "published")) {
      expect(screen.getAllByText(post.date).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has no unfinished placeholders left on the page", () => {
    wrap(<Blog />);
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});

describe("Blog post", () => {
  const post = POSTS[0];

  it("renders each block type the article model supports", () => {
    at(`/blog/${post.slug}`, <BlogPost />, "/blog/:slug");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(post.title);

    const headings = post.content.filter((b) => b.type === "h2");
    for (const block of headings) {
      expect(screen.getByRole("heading", { name: block.text })).toBeInTheDocument();
    }

    const paragraph = post.content.find((b) => b.type === "p");
    expect(screen.getByText(paragraph.text)).toBeInTheDocument();

    const verdict = post.content.find((b) => b.type === "verdict");
    if (verdict) expect(screen.getByText(verdict.text)).toBeInTheDocument();

    const list = post.content.find((b) => b.type === "list");
    if (list) expect(screen.getByText(list.items[0])).toBeInTheDocument();
  });

  it("embeds the original carousel and links to the source", () => {
    at(`/blog/${post.slug}`, <BlogPost />, "/blog/:slug");

    const frame = screen.getByTitle(new RegExp(`${post.title}.*LinkedIn`, "i"));
    expect(frame).toHaveAttribute("src", post.embed);
    expect(frame).toHaveAttribute("loading", "lazy");

    const source = screen.getByRole("link", { name: /originally posted on linkedin/i });
    expect(source).toHaveAttribute("href", post.link);
    expect(source).toHaveAttribute("rel", "noreferrer");
  });

  it("constrains the article to a readable measure", () => {
    const { container } = at(`/blog/${post.slug}`, <BlogPost />, "/blog/:slug");
    expect(container.querySelector("section")).toHaveClass("mx-auto", "max-w-[46rem]");
  });

  it("redirects an unknown slug to the listing", () => {
    at("/blog/nope", <BlogPost />, "/blog/:slug");
    expect(screen.getByText("blog listing")).toBeInTheDocument();
  });

  it("redirects a draft, which has no body to show", async () => {
    const draft = POSTS.find((p) => p.status === "draft");
    if (!draft) return; // every post is published today

    at(`/blog/${draft.slug}`, <BlogPost />, "/blog/:slug");
    expect(screen.getByText("blog listing")).toBeInTheDocument();
  });

  it("lets a reader get back to the listing", async () => {
    const user = userEvent.setup();
    at(`/blog/${post.slug}`, <BlogPost />, "/blog/:slug");

    await user.click(screen.getAllByRole("link", { name: /all posts/i })[0]);
    expect(screen.getByText("blog listing")).toBeInTheDocument();
  });
});
