import { beforeEach, describe, expect, it, vi } from "vitest";

const render = vi.fn();
const createRoot = vi.fn(() => ({ render }));

vi.mock("react-dom/client", () => ({
  default: { createRoot },
  createRoot,
}));

describe("main entry point", () => {
  beforeEach(() => {
    vi.resetModules();
    render.mockClear();
    createRoot.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("mounts the app into #root", async () => {
    await import("../src/main.jsx");

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("renders inside StrictMode so unsafe patterns surface in development", async () => {
    await import("../src/main.jsx");

    const tree = render.mock.calls[0][0];
    expect(tree.type.toString()).toContain("react.strict_mode");
  });
});
