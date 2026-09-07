import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const init = vi.fn();
const trackFn = vi.fn();
const register = vi.fn();

vi.mock("mixpanel-browser", () => ({
  default: { init, track: trackFn, register },
}));

const TOKEN = "test-token";

async function load({ token = TOKEN, doNotTrack = "0" } = {}) {
  vi.resetModules();
  vi.stubEnv("VITE_MIXPANEL_TOKEN", token);
  // jsdom does not define navigator.doNotTrack, so it cannot be spied on.
  Object.defineProperty(navigator, "doNotTrack", { value: doNotTrack, configurable: true });
  return import("../src/lib/analytics");
}

describe("analytics", () => {
  beforeEach(() => {
    init.mockClear();
    trackFn.mockClear();
    register.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("initialises Mixpanel once with the project token", async () => {
    const a = await load();

    expect(a.initAnalytics()).toBe(true);
    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith(TOKEN, expect.objectContaining({ autocapture: true }));
    expect(a.isEnabled()).toBe(true);

    // A second call must not re-initialise and duplicate every event.
    expect(a.initAnalytics()).toBe(false);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("registers super properties so every event carries context", async () => {
    const a = await load();
    a.initAnalytics();

    expect(register).toHaveBeenCalledWith(expect.objectContaining({ site: "portfolio" }));
  });

  it("stays silent when no token is configured", async () => {
    const a = await load({ token: "" });

    expect(a.initAnalytics()).toBe(false);
    expect(a.isEnabled()).toBe(false);

    a.track("Anything");
    expect(init).not.toHaveBeenCalled();
    expect(trackFn).not.toHaveBeenCalled();
  });

  it("honours a Do Not Track signal", async () => {
    const a = await load({ doNotTrack: "1" });

    expect(a.initAnalytics()).toBe(false);
    a.track("Anything");
    expect(init).not.toHaveBeenCalled();
    expect(trackFn).not.toHaveBeenCalled();
  });

  it("forwards events with their properties once enabled", async () => {
    const a = await load();
    a.initAnalytics();

    a.track("Pipeline Run Started", { simulateFailure: true });
    expect(trackFn).toHaveBeenCalledWith("Pipeline Run Started", { simulateFailure: true });
  });

  it("defaults event properties to an empty object", async () => {
    const a = await load();
    a.initAnalytics();

    a.track("Chat Opened");
    expect(trackFn).toHaveBeenCalledWith("Chat Opened", {});
  });

  it("drops events fired before initialisation", async () => {
    const a = await load();

    a.track("Too Early");
    expect(trackFn).not.toHaveBeenCalled();
  });

  it("records page views with the path and document title", async () => {
    const a = await load();
    a.initAnalytics();
    document.title = "Portfolio";

    a.trackPageView("/projects", { referrerless: true });

    expect(trackFn).toHaveBeenCalledWith("Page Viewed", {
      path: "/projects",
      title: "Portfolio",
      referrerless: true,
    });
  });

  it("can be reset so a suite starts from a clean slate", async () => {
    const a = await load();
    a.initAnalytics();
    expect(a.isEnabled()).toBe(true);

    a.resetAnalytics();
    expect(a.isEnabled()).toBe(false);

    a.track("Ignored");
    expect(trackFn).not.toHaveBeenCalled();
  });
});
