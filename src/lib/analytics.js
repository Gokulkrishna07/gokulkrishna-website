import mixpanel from "mixpanel-browser";

// The Mixpanel project token is a write-only, client-side credential — unlike the
// RouteAI key it is meant to ship in the bundle, which is why it carries the
// VITE_ prefix. Without it every call here is a no-op, so dev and tests stay silent.
const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

let ready = false;

export function isEnabled() {
  return ready;
}

export function initAnalytics() {
  if (ready || !TOKEN) return false;

  // Respect an explicit Do Not Track signal rather than tracking anyway.
  if (navigator.doNotTrack === "1") return false;

  mixpanel.init(TOKEN, {
    // Captures clicks, form submissions, input changes and page views without
    // needing a call site for each one.
    autocapture: true,
    persistence: "localStorage",
    ignore_dnt: false,
    record_sessions_percent: 0,
  });

  mixpanel.register({
    site: "portfolio",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  });

  ready = true;
  return true;
}

export function track(event, props = {}) {
  if (!ready) return;
  mixpanel.track(event, props);
}

export function trackPageView(path, extra = {}) {
  track("Page Viewed", { path, title: document.title, ...extra });
}

// Exported for tests: lets a suite start from a clean slate.
export function resetAnalytics() {
  ready = false;
}
