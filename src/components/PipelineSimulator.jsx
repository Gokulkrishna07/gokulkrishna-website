import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  CircleDot,
  Clock,
  GitCommitHorizontal,
  Loader2,
  Play,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { track } from "../lib/analytics";

const RUN_NUMBER = 47;
const COMMIT = "8f3c21d";
const BRANCH = "main";

const STAGES = [
  {
    id: "checkout",
    name: "checkout",
    duration: 4,
    steps: [
      { name: "Set up job", logs: ["Current runner version: '2.322.0'", "Runner name: 'ubuntu-22.04'"] },
      {
        name: "Run actions/checkout@v4",
        logs: [
          "Syncing repository (fetch-depth: 0)",
          "/usr/bin/git init /home/runner/work/platform",
          "HEAD is now at 8f3c21d feat: add rollout strategy",
        ],
      },
    ],
  },
  {
    id: "build",
    name: "build",
    duration: 38,
    steps: [
      {
        name: "Run npm ci",
        logs: ["npm ci --prefer-offline --no-audit", "added 1043 packages in 12s"],
      },
      { name: "Run npm run build", logs: ["vite v8.2.2 building for production...", "built in 4.21s"] },
    ],
  },
  {
    id: "test",
    name: "test",
    duration: 26,
    steps: [
      {
        name: "Run npm run test",
        logs: ["Test Suites: 24 passed, 24 total", "Tests: 186 passed, 186 total", "Coverage: 87.4%"],
      },
    ],
  },
  {
    id: "scan",
    name: "sonarqube-scan",
    duration: 31,
    steps: [
      {
        name: "Run sonar-scanner",
        logs: ["INFO: Analyzing 412 source files", "INFO: Quality gate status: PASSED"],
        failLogs: [
          "INFO: Analyzing 412 source files",
          "ERROR: Quality gate status: FAILED",
          "ERROR: 3 new vulnerabilities on new code (threshold: 0)",
        ],
      },
    ],
  },
  {
    id: "image",
    name: "build-and-push",
    duration: 52,
    steps: [
      {
        name: "Build and push image",
        logs: [
          "docker build -t registry/service:8f3c21d .",
          "=> exporting layers  12.4s",
          "pushed registry/service:8f3c21d (142MB)",
        ],
      },
    ],
  },
  {
    id: "deploy",
    name: "deploy-production",
    duration: 44,
    steps: [
      {
        name: "Helm upgrade",
        logs: [
          "helm upgrade --install service ./chart --atomic",
          "Waiting for rollout: 3 of 3 replicas ready",
          "Release 'service' has been upgraded. Revision: 24",
        ],
      },
    ],
  },
  {
    id: "notify",
    name: "notify",
    duration: 3,
    steps: [{ name: "Notify Teams", logs: ["POST teams-webhook -> 200 OK"] }],
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pad = (n, w = 2) => String(n).padStart(w, "0");

function timestamp(offsetSeconds) {
  const base = new Date(Date.UTC(2026, 8, 6, 5, 12, 3));
  base.setUTCSeconds(base.getUTCSeconds() + offsetSeconds);
  return `${base.toISOString().slice(0, 19)}.${pad(Math.floor(Math.random() * 9999), 4)}000Z`;
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${pad(seconds % 60)}s`;
}

function StatusIcon({ state, className = "h-4 w-4" }) {
  if (state === "running")
    return <Loader2 className={`${className} animate-spin text-[#d29922]`} />;
  if (state === "success")
    return (
      <svg viewBox="0 0 16 16" className={`${className} fill-[#3fb950]`} aria-hidden="true">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.78-9.72-4.25 4.25a.75.75 0 0 1-1.06 0L4.22 8.28a.75.75 0 1 1 1.06-1.06l1.72 1.72 3.72-3.72a.75.75 0 1 1 1.06 1.06Z" />
      </svg>
    );
  if (state === "failed")
    return (
      <svg viewBox="0 0 16 16" className={`${className} fill-[#f85149]`} aria-hidden="true">
        <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.75.75 0 0 0-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 1 0 1.06 1.06L8 9.06l1.97 1.97a.75.75 0 1 0 1.06-1.06L9.06 8l1.97-1.97a.75.75 0 0 0-1.06-1.06L8 6.94Z" />
      </svg>
    );
  if (state === "skipped")
    return (
      <svg viewBox="0 0 16 16" className={`${className} fill-[#6e7681]`} aria-hidden="true">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm-3-8a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
      </svg>
    );
  return <Clock className={`${className} text-[#6e7681]`} />;
}

export default function PipelineSimulator() {
  const [status, setStatus] = useState("idle");
  const [stageStates, setStageStates] = useState({});
  const [stageTimes, setStageTimes] = useState({});
  const [logs, setLogs] = useState({});
  const [openStage, setOpenStage] = useState(null);
  const [shouldFail, setShouldFail] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const runIdRef = useRef(0);
  const logRef = useRef(null);

  useEffect(() => () => runIdRef.current++, []);

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs, openStage]);

  async function run() {
    const runId = ++runIdRef.current;
    const alive = () => runIdRef.current === runId;

    track("Pipeline Run Started", { simulateFailure: shouldFail });
    setStatus("running");
    setStageStates({});
    setStageTimes({});
    setLogs({});
    setElapsed(0);

    let clock = 0;

    for (const stage of STAGES) {
      const fails = shouldFail && stage.id === "scan";

      setStageStates((prev) => ({ ...prev, [stage.id]: "running" }));
      setOpenStage(stage.id);
      setLogs((prev) => ({ ...prev, [stage.id]: [] }));

      for (const step of stage.steps) {
        const stepLogs = fails && step.failLogs ? step.failLogs : step.logs;

        setLogs((prev) => ({
          ...prev,
          [stage.id]: [...prev[stage.id], { type: "step", text: step.name }],
        }));

        for (const line of stepLogs) {
          await sleep(300);
          if (!alive()) return;
          clock += 1;
          const type = line.startsWith("ERROR") ? "error" : "log";
          setLogs((prev) => ({
            ...prev,
            [stage.id]: [...prev[stage.id], { type, text: line, ts: timestamp(clock) }],
          }));
        }
      }

      await sleep(200);
      if (!alive()) return;

      setStageTimes((prev) => ({ ...prev, [stage.id]: stage.duration }));

      if (fails) {
        setStageStates((prev) => ({ ...prev, [stage.id]: "failed" }));
        setLogs((prev) => ({
          ...prev,
          [stage.id]: [
            ...prev[stage.id],
            { type: "error", text: "Process completed with exit code 1.", ts: timestamp(++clock) },
          ],
        }));

        const rest = STAGES.slice(STAGES.indexOf(stage) + 1);
        setStageStates((prev) => ({
          ...prev,
          ...Object.fromEntries(rest.map((s) => [s.id, "skipped"])),
        }));
        track("Pipeline Run Finished", { result: "failed", failedAt: stage.id });
        setStatus("failed");
        return;
      }

      setStageStates((prev) => ({ ...prev, [stage.id]: "success" }));
    }

    track("Pipeline Run Finished", { result: "success" });
    setStatus("success");
  }

  function reset() {
    runIdRef.current++;
    setStatus("idle");
    setStageStates({});
    setStageTimes({});
    setLogs({});
    setOpenStage(null);
    setElapsed(0);
  }

  const running = status === "running";
  const totalDuration = Object.values(stageTimes).reduce((a, b) => a + b, 0);
  const activeLogs = openStage ? logs[openStage] : [];
  const activeStage = STAGES.find((s) => s.id === openStage);

  return (
    <section className="border-t border-white/10 bg-neutral-950 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
          Try It Yourself
        </span>
      </div>

      <h2 className="mt-4 font-podium text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white">
        Run My Pipeline
      </h2>

      <p className="mt-5 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
        A working replica of the GitHub Actions workflows I ship every day. Run it, watch the job
        graph fill in, and open any job to read its logs. Flip the switch to see what happens when
        the quality gate fails.
      </p>

      {/* GitHub Actions run panel */}
      <div className="mt-10 overflow-hidden rounded-md border border-[#30363d] bg-[#0d1117] font-inter">
        {/* Run header */}
        <div className="border-b border-[#30363d] px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#e6edf3] sm:text-lg">
                feat: add rollout strategy
                <span className="font-normal text-[#8b949e]">#{RUN_NUMBER}</span>
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8b949e]">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    status === "success"
                      ? "bg-[#238636] text-white"
                      : status === "failed"
                        ? "bg-[#da3633] text-white"
                        : status === "running"
                          ? "bg-[#9e6a03] text-white"
                          : "bg-[#21262d] text-[#8b949e]"
                  }`}
                >
                  {running && <Loader2 className="h-3 w-3 animate-spin" />}
                  {status === "idle"
                    ? "Waiting"
                    : status === "running"
                      ? "In progress"
                      : status === "success"
                        ? "Success"
                        : "Failure"}
                </span>

                <span>deploy.yml</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <GitCommitHorizontal className="h-3.5 w-3.5" />
                  <code className="font-mono">{COMMIT}</code>
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <CircleDot className="h-3.5 w-3.5" />
                  {BRANCH}
                </span>
                {(running || status !== "idle") && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {running ? formatDuration(elapsed) : formatDuration(totalDuration)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="hidden cursor-pointer items-center gap-2 text-xs text-[#8b949e] sm:flex">
                <input
                  type="checkbox"
                  checked={shouldFail}
                  onChange={(e) => setShouldFail(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#f85149]"
                />
                Simulate failure
              </label>

              <button
                type="button"
                onClick={status === "idle" ? run : running ? undefined : run}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#c9d1d9] transition-colors hover:bg-[#30363d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {running ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : status === "idle" ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                {running ? "Running" : status === "idle" ? "Run workflow" : "Re-run all jobs"}
              </button>

              {status !== "idle" && !running && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-[#8b949e] transition-colors hover:text-[#c9d1d9]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-[#8b949e] sm:hidden">
            <input
              type="checkbox"
              checked={shouldFail}
              onChange={(e) => setShouldFail(e.target.checked)}
              className="h-3.5 w-3.5 accent-[#f85149]"
            />
            Simulate failure
          </label>
        </div>

        {/* Failure annotation */}
        {status === "failed" && (
          <div className="flex items-start gap-2 border-b border-[#30363d] bg-[#f85149]/10 px-4 py-3 text-xs text-[#f85149] sm:px-6">
            <TriangleAlert className="mt-px h-4 w-4 shrink-0" />
            <span>
              <strong className="font-semibold">sonarqube-scan</strong> failed the quality gate.
              Downstream jobs were skipped and a failure alert was sent to Teams.
            </span>
          </div>
        )}

        {/* Job graph */}
        <div className="border-b border-[#30363d] bg-[#0d1117] px-4 py-6 sm:px-6">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-[#8b949e]">
            Jobs
          </p>

          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {STAGES.map((stage, i) => {
              const state = stageStates[stage.id] ?? "pending";
              const isOpen = openStage === stage.id;
              const done = state === "success";

              return (
                <div key={stage.id} className="flex shrink-0 items-center">
                  {i > 0 && (
                    <span
                      className={`h-px w-6 shrink-0 sm:w-8 ${done || state === "running" ? "bg-[#3fb950]" : "bg-[#30363d]"}`}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setOpenStage(stage.id);
                      track("Pipeline Job Opened", { job: stage.id });
                    }}
                    disabled={state === "pending"}
                    className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                      isOpen
                        ? "border-[#58a6ff] bg-[#161b22]"
                        : state === "pending"
                          ? "cursor-default border-[#30363d] bg-[#0d1117]"
                          : "border-[#30363d] bg-[#161b22] hover:border-[#8b949e]"
                    }`}
                  >
                    <StatusIcon state={state} />
                    <span
                      className={
                        state === "pending" || state === "skipped"
                          ? "text-[#6e7681]"
                          : "text-[#c9d1d9]"
                      }
                    >
                      {stage.name}
                    </span>
                    {stageTimes[stage.id] && (
                      <span className="font-mono text-[10px] text-[#8b949e]">
                        {formatDuration(stageTimes[stage.id])}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log viewer */}
        <div className="bg-[#0d1117]">
          <div className="flex items-center gap-2 border-b border-[#30363d] px-4 py-2.5 text-xs text-[#8b949e] sm:px-6">
            <ChevronRight className="h-3.5 w-3.5" />
            {activeStage ? (
              <>
                <StatusIcon state={stageStates[openStage]} className="h-3.5 w-3.5" />
                <span className="text-[#c9d1d9]">{activeStage.name}</span>
              </>
            ) : (
              <span>No job selected</span>
            )}
          </div>

          <div
            ref={logRef}
            className="max-h-72 min-h-[4.5rem] overflow-y-auto px-4 py-3 font-mono text-[11px] leading-[1.7] sm:px-6"
          >
            {activeLogs.length === 0 ? (
              <p className="text-[#6e7681]">
                Waiting for workflow_dispatch — press Run workflow.
              </p>
            ) : (
              activeLogs.map((line, i) =>
                line.type === "step" ? (
                  <p
                    key={`${line.text}-${i}`}
                    className="mt-3 flex items-center gap-2 font-semibold text-[#58a6ff] first:mt-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {line.text}
                  </p>
                ) : (
                  <p key={`${line.text}-${i}`} className="flex gap-3 pl-5">
                    <span className="hidden shrink-0 text-[#484f58] sm:inline">{line.ts}</span>
                    <span className={line.type === "error" ? "text-[#f85149]" : "text-[#c9d1d9]"}>
                      {line.text}
                    </span>
                  </p>
                ),
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
