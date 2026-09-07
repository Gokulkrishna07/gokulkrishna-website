import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, MessageSquare, X } from "lucide-react";
import { track } from "../lib/analytics";

const CONTEXT = `You are the assistant on the portfolio site of Gokulkrishna A B, a Cloud and DevOps engineer based in Ernakulam, Kerala, India.
Facts you may use: two years of experience; currently at Edstem Technologies since Nov 2024; works with Kubernetes, Docker, Helm, Terraform, GitHub Actions, APISIX, Nginx, Prometheus, Grafana, SonarQube, AWS, DigitalOcean and Proxmox; B.Tech in Computer Science from Kerala Technological University; reachable at gokulkrishnaab7@gmail.com.
Answer in at most three short sentences, plainly and without marketing language. If you do not know something about him, say so and suggest using the contact page rather than guessing.`;

const SUGGESTIONS = [
  "What does Gokulkrishna work on?",
  "What is his experience with Kubernetes?",
  "How do I get in touch?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me anything about Gokulkrishna's work, stack or experience.",
    },
  ]);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(text, source = "input") {
    const prompt = text.trim();
    if (!prompt || busy) return;

    track("Chat Question Asked", { source, length: prompt.length });

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${CONTEXT}\n\nQuestion: ${prompt}` }),
      });

      const data = await res.json();
      const reply = data?.data?.response?.trim();
      track("Chat Reply Received", { ok: res.ok, answered: Boolean(reply) });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.ok && reply ? reply : "That did not go through. Try again in a moment.",
        },
      ]);
    } catch {
      track("Chat Failed", { reason: "network" });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I could not reach the server. Try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          track(open ? "Chat Closed" : "Chat Opened");
        }}
        aria-label={open ? "Close chat" : "Ask about Gokulkrishna"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      <div
        className={`fixed bottom-24 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-950 shadow-2xl transition-all duration-300 sm:right-7 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        role="dialog"
        aria-label="Ask about Gokulkrishna"
      >
        <div className="border-b border-white/10 px-5 py-4">
          <p className="font-podium text-lg uppercase tracking-tight text-white">Ask about me</p>
          <p className="mt-0.5 font-inter text-[10px] uppercase tracking-widest text-white/35">
            Answers are generated, so check anything important
          </p>
        </div>

        <div ref={scrollRef} className="max-h-[22rem] min-h-[12rem] overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 font-inter text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.04] text-white/75"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-inter text-sm text-white/50">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking
              </span>
            </div>
          )}

          {messages.length === 1 && !busy && (
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s, "suggestion")}
                  className="border border-white/15 px-2.5 py-1.5 text-left font-inter text-[11px] text-white/55 transition-colors hover:border-white/35 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question"
            aria-label="Your question"
            className="min-w-0 flex-1 bg-transparent px-2 py-2 font-inter text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-black transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
