import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../api/chat";

const ROUTE_AI = "https://routeai-backend-btbb.onrender.com/api/v1/chat";

function mockRes() {
  const res = { statusCode: null, body: null };
  res.status = vi.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn((payload) => {
    res.body = payload;
    return res;
  });
  return res;
}

describe("api/chat handler", () => {
  beforeEach(() => {
    process.env.ROUTEAI_API_KEY = "test-key";
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    delete process.env.ROUTEAI_API_KEY;
  });

  it("rejects anything that is not a POST", async () => {
    const res = mockRes();
    await handler({ method: "GET" }, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.body).toEqual({ error: "Method not allowed" });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("fails loudly when the key is missing rather than calling upstream", async () => {
    delete process.env.ROUTEAI_API_KEY;
    const res = mockRes();

    await handler({ method: "POST", body: { prompt: "hello" } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body.error).toMatch(/ROUTEAI_API_KEY/);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it.each([
    ["missing body", {}],
    ["empty prompt", { prompt: "" }],
    ["whitespace prompt", { prompt: "   " }],
    ["non-string prompt", { prompt: 42 }],
  ])("rejects a request with a %s", async (_label, body) => {
    const res = mockRes();
    await handler({ method: "POST", body }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual({ error: "prompt is required" });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("forwards the prompt with the key attached server side", async () => {
    globalThis.fetch.mockResolvedValue({
      status: 200,
      json: async () => ({ data: { response: "hi" } }),
    });

    const res = mockRes();
    await handler({ method: "POST", body: { prompt: "hello" } }, res);

    const [url, init] = globalThis.fetch.mock.calls[0];
    expect(url).toBe(ROUTE_AI);
    expect(init.method).toBe("POST");
    expect(init.headers["x-api-key"]).toBe("test-key");
    expect(JSON.parse(init.body)).toEqual({ prompt: "hello" });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body).toEqual({ data: { response: "hi" } });
  });

  it("truncates an oversized prompt instead of relaying it", async () => {
    globalThis.fetch.mockResolvedValue({ status: 200, json: async () => ({}) });

    const res = mockRes();
    await handler({ method: "POST", body: { prompt: "x".repeat(5000) } }, res);

    const sent = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(sent.prompt).toHaveLength(2000);
  });

  it("passes an upstream error status through unchanged", async () => {
    globalThis.fetch.mockResolvedValue({
      status: 429,
      json: async () => ({ error: "rate limited" }),
    });

    const res = mockRes();
    await handler({ method: "POST", body: { prompt: "hello" } }, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.body).toEqual({ error: "rate limited" });
  });

  it("returns 502 when the upstream call throws", async () => {
    globalThis.fetch.mockRejectedValue(new Error("network down"));

    const res = mockRes();
    await handler({ method: "POST", body: { prompt: "hello" } }, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.body).toEqual({ error: "Upstream request failed" });
  });

  it("never echoes the api key back to the caller", async () => {
    globalThis.fetch.mockResolvedValue({ status: 200, json: async () => ({ ok: true }) });

    const res = mockRes();
    await handler({ method: "POST", body: { prompt: "hello" } }, res);

    expect(JSON.stringify(res.body)).not.toContain("test-key");
  });
});
