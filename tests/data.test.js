import { describe, expect, it } from "vitest";
import { PROJECTS, getProject } from "../src/data/projects";
import { POSTS, getPost } from "../src/data/posts";

describe("projects data", () => {
  it("exposes every project with the fields both pages render", () => {
    expect(PROJECTS.length).toBeGreaterThan(0);

    for (const project of PROJECTS) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.title).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.metric).toBeTruthy();
      expect(project.overview).toBeTruthy();
      expect(project.responsibilities.length).toBeGreaterThan(0);
      expect(Array.isArray(project.tags)).toBe(true);
      expect(typeof project.icon).toBe("object");
    }
  });

  it("keeps slugs unique so routing cannot collide", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("never leaks a real client or product name", () => {
    // Client names are deliberately withheld; only the engineering is public.
    const withheld = ["setfit", "lambda books", "keyvault", "presence monitor", "lamaos"];
    const haystack = JSON.stringify(PROJECTS).toLowerCase();

    for (const name of withheld) {
      expect(haystack).not.toContain(name);
    }
  });

  it("avoids glyphs the display font cannot render in titles", () => {
    for (const project of PROJECTS) {
      expect(project.title).not.toMatch(/[&/]/);
    }
  });

  it("looks a project up by slug", () => {
    const first = PROJECTS[0];
    expect(getProject(first.slug)).toBe(first);
  });

  it("returns undefined for an unknown slug so the page can redirect", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});

describe("posts data", () => {
  it("exposes every post with the fields the listing renders", () => {
    expect(POSTS.length).toBeGreaterThan(0);

    for (const post of POSTS) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.title).toBeTruthy();
      expect(post.summary).toBeTruthy();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(["published", "draft"]).toContain(post.status);
      expect(Array.isArray(post.content)).toBe(true);
    }
  });

  it("keeps slugs unique", () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every published post a date and a body", () => {
    for (const post of POSTS.filter((p) => p.status === "published")) {
      expect(post.date).toBeTruthy();
      expect(post.content.length).toBeGreaterThan(0);
    }
  });

  it("only uses block types the renderer understands", () => {
    const known = new Set(["p", "h2", "verdict", "list"]);

    for (const post of POSTS) {
      for (const block of post.content) {
        expect(known).toContain(block.type);

        if (block.type === "list") {
          expect(block.items.length).toBeGreaterThan(0);
        } else {
          expect(block.text).toBeTruthy();
        }
      }
    }
  });

  it("builds LinkedIn links and embeds from the two different ids", () => {
    for (const post of POSTS.filter((p) => p.link)) {
      expect(post.link).toMatch(/^https:\/\/www\.linkedin\.com\/feed\/update\/urn:li:activity:\d+$/);
      expect(post.embed).toMatch(
        /^https:\/\/www\.linkedin\.com\/embed\/feed\/update\/urn:li:ugcPost:\d+\?collapsed=1$/,
      );
      // The embed id is a different urn to the activity id — mixing them shows the wrong post.
      expect(post.embed).not.toContain("activity");
    }
  });

  it("orders posts newest first", () => {
    const dated = POSTS.filter((p) => p.date).map((p) => new Date(p.date).getTime());
    const sorted = [...dated].sort((a, b) => b - a);
    expect(dated).toEqual(sorted);
  });

  it("looks a post up by slug and returns undefined otherwise", () => {
    expect(getPost(POSTS[0].slug)).toBe(POSTS[0]);
    expect(getPost("nope")).toBeUndefined();
  });
});
