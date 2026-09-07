import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "../src/components/ChatWidget";

const reply = (text) => ({
  ok: true,
  json: async () => ({ data: { response: text } }),
});

const panel = () => screen.getByRole("dialog", { name: /ask about gokulkrishna/i });
const open = async (user) => {
  await user.click(screen.getByRole("button", { name: /ask about gokulkrishna/i }));
};

describe("ChatWidget", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it("starts closed with a greeting ready", () => {
    render(<ChatWidget />);

    expect(panel()).toHaveClass("pointer-events-none", "opacity-0");
    expect(screen.getByText(/ask me anything about gokulkrishna/i)).toBeInTheDocument();
  });

  it("toggles open and closed from the floating button", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await open(user);
    expect(panel()).toHaveClass("opacity-100");

    await user.click(screen.getByRole("button", { name: /close chat/i }));
    expect(panel()).toHaveClass("opacity-0");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await open(user);
    await user.keyboard("{Escape}");

    expect(panel()).toHaveClass("opacity-0");
  });

  it("warns that answers are generated", () => {
    render(<ChatWidget />);
    expect(screen.getByText(/answers are generated/i)).toBeInTheDocument();
  });

  it("sends a question through the proxy and shows the reply", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue(reply("He runs Kubernetes in production."));
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "What does he do?");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText(/he runs kubernetes in production/i)).toBeInTheDocument();

    const [url, init] = globalThis.fetch.mock.calls[0];
    expect(url).toBe("/api/chat");
    expect(init.method).toBe("POST");
    // The key must never be attached in the browser — that is the proxy's job.
    expect(JSON.stringify(init.headers)).not.toMatch(/api-key/i);

    const body = JSON.parse(init.body);
    expect(body.prompt).toContain("What does he do?");
    expect(body.prompt).toContain("Gokulkrishna");
  });

  it("clears the input and echoes the question as the user's message", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue(reply("ok"));
    render(<ChatWidget />);

    await open(user);
    const input = screen.getByLabelText(/your question/i);
    await user.type(input, "Hello there");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(input).toHaveValue("");
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("submits with Enter as well as the button", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue(reply("done"));
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "Ping{Enter}");

    expect(await screen.findByText("done")).toBeInTheDocument();
  });

  it("offers starter questions and sends one on click", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue(reply("By email."));
    render(<ChatWidget />);

    await open(user);
    await user.click(screen.getByRole("button", { name: /how do i get in touch/i }));

    expect(await screen.findByText("By email.")).toBeInTheDocument();
    // Suggestions disappear once a conversation has started.
    expect(screen.queryByRole("button", { name: /how do i get in touch/i })).not.toBeInTheDocument();
  });

  it("disables send while a request is in flight and shows progress", async () => {
    const user = userEvent.setup();
    let resolve;
    globalThis.fetch.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "Slow one");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^send$/i })).toBeDisabled();

    resolve(reply("finally"));
    expect(await screen.findByText("finally")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument());
  });

  it("keeps send disabled for an empty or whitespace question", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await open(user);
    const send = screen.getByRole("button", { name: /^send$/i });
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText(/your question/i), "   ");
    expect(send).toBeDisabled();
    expect(globalThis.fetch).not.toHaveBeenCalled();

    // A disabled submit button blocks implicit submission, but the handler must
    // still refuse an empty prompt if a submit reaches it by any other route.
    fireEvent.submit(document.querySelector("form"));
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument();
  });

  it("reports a readable message when the server errors", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({ ok: false, json: async () => ({ error: "boom" }) });
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "Anything{Enter}");

    expect(await screen.findByText(/did not go through/i)).toBeInTheDocument();
  });

  it("reports a readable message when the reply has no text", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => ({ data: {} }) });
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "Anything{Enter}");

    expect(await screen.findByText(/did not go through/i)).toBeInTheDocument();
  });

  it("reports a readable message when the network is unreachable", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockRejectedValue(new Error("offline"));
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "Anything{Enter}");

    expect(await screen.findByText(/could not reach the server/i)).toBeInTheDocument();
  });

  it("recovers and accepts a new question after a failure", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockRejectedValueOnce(new Error("offline")).mockResolvedValue(reply("back"));
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "First{Enter}");
    await screen.findByText(/could not reach the server/i);

    await user.type(screen.getByLabelText(/your question/i), "Second{Enter}");
    expect(await screen.findByText("back")).toBeInTheDocument();
  });
  it("ignores a second question while one is still in flight", async () => {
    const user = userEvent.setup();
    let resolve;
    globalThis.fetch.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    render(<ChatWidget />);

    await open(user);
    await user.type(screen.getByLabelText(/your question/i), "First{Enter}");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // The send button is disabled, but the form can still be submitted with Enter.
    await user.type(screen.getByLabelText(/your question/i), "Second{Enter}");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolve(reply("done"));
    expect(await screen.findByText("done")).toBeInTheDocument();
  });
});
