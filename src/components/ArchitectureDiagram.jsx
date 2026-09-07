import { useState } from "react";
import TechIcon from "./TechIcon";
import PodiumText from "./PodiumText";
import { track } from "../lib/analytics";

const NODES = {
  users: {
    label: "Users",
    kind: "Client",
    x: 450,
    y: 45,
    tier: "Entry",
    detail:
      "Dealership staff and customer facing clients hitting the platform. Everything below exists to keep this layer fast and available.",
    points: [
      "Staff, partner networks and customer facing clients",
      "Every layer below exists to keep this one fast and available",
    ],
    tech: [],
  },
  ingress: {
    label: "Nginx",
    kind: "Reverse Proxy",
    x: 450,
    y: 150,
    tier: "Entry",
    detail:
      "Terminates incoming production traffic and forwards it inward. On the self hosted deployments this is what sits in front of everything else.",
    points: [
      "Fronts the self hosted deployments",
      "Terminates and forwards production traffic",
      "Configured on Proxmox hosted infrastructure",
    ],
    tech: ["Nginx"],
  },
  gateway: {
    label: "APISIX",
    kind: "API Gateway",
    x: 450,
    y: 255,
    tier: "Edge",
    detail:
      "A self hosted gateway that routes and secures traffic across every microservice. One place to handle auth, rate limits and routing rules instead of rebuilding them in each service.",
    points: [
      "One place for auth, rate limits and routing",
      "Self hosted rather than a managed gateway",
      "Fronts every service in the cluster",
    ],
    tech: ["APISIX"],
  },
  cicd: {
    label: "GitHub Actions",
    kind: "CI/CD",
    x: 150,
    y: 150,
    tier: "Delivery",
    detail:
      "Every commit builds, tests, scans and ships. Helm packages the release, the pipeline promotes it through environments, and a webhook tells the team when something fails.",
    points: [
      "Build, test, scan and ship on every commit",
      "Helm packages each release",
      "SonarQube gates merges on quality and security",
      "Teams and Slack webhooks fire on failure",
    ],
    tech: ["GitHub Actions", "Helm", "SonarQube"],
  },
  core: {
    label: "Core Services",
    kind: "Business Logic",
    x: 150,
    y: 390,
    tier: "Compute",
    detail:
      "The business services behind the platform, containerized and deployed to managed Kubernetes. Six and growing, each with its own release cadence.",
    points: [
      "6+ services in production and growing",
      "Deployed to DigitalOcean Kubernetes (DOKS)",
      "Each service ships on its own cadence",
    ],
    tech: ["Kubernetes", "Docker"],
  },
  ml: {
    label: "AI / ML Services",
    kind: "Inference",
    x: 450,
    y: 390,
    tier: "Compute",
    detail:
      "Model serving workloads running alongside the business services in the same cluster, isolated by namespace and resource limits.",
    points: [
      "Runs beside the business services in one cluster",
      "Isolated by namespace and resource limits",
      "Scales independently of the request path",
    ],
    tech: ["Kubernetes", "Docker"],
  },
  workers: {
    label: "Workers",
    kind: "Async Jobs",
    x: 750,
    y: 390,
    tier: "Compute",
    detail:
      "Background processing that must not block a request path — scheduled work, queue consumers and long running jobs.",
    points: [
      "Keeps slow work off the request path",
      "Scheduled jobs and queue consumers",
      "Scales horizontally under load",
    ],
    tech: ["Kubernetes"],
  },
  postgres: {
    label: "PostgreSQL",
    kind: "Relational",
    x: 300,
    y: 525,
    tier: "Data",
    detail: "Primary transactional store for the platform's relational data.",
    points: [
      "Primary transactional store",
      "Backed up and monitored like any other workload",
    ],
    tech: [],
  },
  observability: {
    label: "Prometheus",
    kind: "Metrics",
    x: 750,
    y: 525,
    tier: "Observability",
    detail:
      "Scrapes metrics from every service in the cluster so problems are visible before a user reports them.",
    points: [
      "Scrapes metrics from every service",
      "Surfaces problems before users report them",
      "Feeds the dashboards the team watches",
    ],
    tech: ["Prometheus"],
  },
  alerting: {
    label: "Grafana",
    kind: "Dashboards and Alerts",
    x: 750,
    y: 645,
    tier: "Observability",
    detail:
      "Dashboards for real time system health, wired to Slack and Teams so a failure pages the team instead of waiting to be noticed.",
    points: [
      "Real time dashboards for system health",
      "Alerts routed to Slack and Microsoft Teams",
      "A failure pages the team instead of going unnoticed",
    ],
    tech: ["Grafana"],
  },
};

const EDGES = [
  ["users", "ingress"],
  ["ingress", "gateway"],
  ["gateway", "core"],
  ["gateway", "ml"],
  ["gateway", "workers"],
  ["core", "postgres"],
  ["ml", "postgres"],
  ["cicd", "gateway", "dashed"],
  ["workers", "observability", "dashed"],
  ["observability", "alerting"],
];

const NODE_W = 196;
const NODE_H = 60;

const TIERS = ["Entry", "Edge", "Compute", "Data", "Delivery", "Observability"];

export default function ArchitectureDiagram() {
  const [selected, setSelected] = useState("gateway");

  const select = (id, surface) => {
    setSelected(id);
    track("Architecture Node Selected", { node: id, surface });
  };
  const active = NODES[selected];
  const isOn = (id) => selected === id;

  return (
    <section className="border-t border-white/10 bg-neutral-950 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
          How It Fits Together
        </span>
      </div>

      <h2 className="mt-4 font-podium text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white">
        The Architecture
      </h2>

      <p className="mt-5 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
        The shape of the platforms I run: traffic in through a gateway, services on managed
        Kubernetes, data behind them, and monitoring watching the whole thing. Pick any piece to see
        what it does.
      </p>

      <div className="mt-12 grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Flow chart — left */}
        <div
          className="flex items-center rounded-xl p-5 shadow-2xl ring-1 ring-white/10 sm:p-7"
          style={{
            backgroundColor: "#fbfcfe",
            backgroundImage:
              "radial-gradient(circle, rgba(37,99,235,0.30) 1.15px, transparent 1.15px)",
            backgroundSize: "22px 22px",
          }}
        >
          <div className="hidden w-full md:block">
            <svg
              viewBox="0 0 900 700"
              className="w-full"
              role="group"
              aria-label="Platform architecture diagram"
            >
              <defs>
                <filter id="node-shadow" x="-30%" y="-40%" width="160%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="4"
                    floodColor="#0f172a"
                    floodOpacity="0.13"
                  />
                </filter>
                <filter id="node-shadow-on" x="-40%" y="-50%" width="180%" height="220%">
                  <feDropShadow
                    dx="0"
                    dy="5"
                    stdDeviation="7"
                    floodColor="#2563eb"
                    floodOpacity="0.35"
                  />
                </filter>
              </defs>

              {EDGES.map(([from, to, style]) => {
                const a = NODES[from];
                const b = NODES[to];
                const lit = isOn(from) || isOn(to);
                const sy = a.y + NODE_H / 2;
                const ey = b.y - NODE_H / 2;
                const my = (sy + ey) / 2;

                // Straight down when the nodes share a column, otherwise step across.
                const path =
                  a.x === b.x
                    ? `M ${a.x} ${sy} L ${b.x} ${ey}`
                    : `M ${a.x} ${sy} L ${a.x} ${my} L ${b.x} ${my} L ${b.x} ${ey}`;

                return (
                  <path
                    key={`${from}-${to}`}
                    d={path}
                    fill="none"
                    stroke={lit ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={lit ? 2.25 : 1.5}
                    strokeDasharray={style === "dashed" ? "5 5" : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}

              {Object.entries(NODES).map(([id, node]) => {
                const on = isOn(id);
                return (
                  <g
                    key={id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label}, ${node.kind}`}
                    aria-pressed={on}
                    onClick={() => select(id, "diagram")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(id, "diagram");
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <rect
                      x={node.x - NODE_W / 2}
                      y={node.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                      rx="10"
                      fill={on ? "#eff6ff" : "#ffffff"}
                      stroke={on ? "#2563eb" : "#dbe2ea"}
                      strokeWidth={on ? 2 : 1}
                      filter={on ? "url(#node-shadow-on)" : "url(#node-shadow)"}
                      className="transition-all duration-300"
                    />
                    <text
                      x={node.x}
                      y={node.y - 3}
                      textAnchor="middle"
                      fill={on ? "#1d4ed8" : "#0f172a"}
                      style={{ font: "600 16px Inter, system-ui, sans-serif" }}
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 17}
                      textAnchor="middle"
                      fill={on ? "#3b82f6" : "#7c8ba1"}
                      style={{
                        font: "500 11px Inter, system-ui, sans-serif",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {node.kind.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Mobile flow */}
          <div className="w-full md:hidden">
            {TIERS.map((tier) => {
              const nodes = Object.entries(NODES).filter(([, n]) => n.tier === tier);

              return (
                <div key={tier} className="relative pb-5 pl-6">
                  <span className="absolute left-[3px] top-2 h-full w-px bg-slate-300" />
                  <span className="absolute left-0 top-1.5 h-2 w-2 rotate-45 bg-blue-500" />

                  <p className="font-inter text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    {tier}
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {nodes.map(([id, node]) => {
                      const on = isOn(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => select(id, "list")}
                          className={`min-h-[56px] rounded-lg border px-3 py-2.5 text-left shadow-sm transition-all ${
                            on
                              ? "border-blue-500 bg-blue-50 shadow-blue-500/25"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <span
                            className={`block font-inter text-xs font-semibold ${
                              on ? "text-blue-700" : "text-slate-900"
                            }`}
                          >
                            {node.label}
                          </span>
                          <span
                            className={`mt-0.5 block font-inter text-[9px] uppercase tracking-widest ${
                              on ? "text-blue-500" : "text-slate-400"
                            }`}
                          >
                            {node.kind}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation — right */}
        <aside className="flex">
          <div className="flex h-full w-full flex-col border border-white/12 bg-white/[0.02] p-7 sm:p-10">
            <p className="font-inter text-[10px] uppercase tracking-[0.25em] text-blue-400 sm:text-xs">
              {active.kind}
            </p>

            <h3 className="mt-3 font-podium text-3xl uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              <PodiumText>{active.label}</PodiumText>
            </h3>

            <p className="mt-6 font-inter text-base leading-relaxed text-white/65 lg:text-lg">
              {active.detail}
            </p>

            <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
              {active.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-blue-400" />
                  <span className="font-inter text-sm leading-relaxed text-white/55">{point}</span>
                </li>
              ))}
            </ul>

            {active.tech.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {active.tech.map((tag) => (
                  <li
                    key={tag}
                    className="flex items-center gap-2 border border-white/15 px-3 py-1.5 font-inter text-[11px] uppercase tracking-wider text-white/60"
                  >
                    <TechIcon name={tag} />
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-auto pt-8 font-inter text-[10px] uppercase tracking-widest text-white/25">
              {Object.keys(NODES).indexOf(selected) + 1} of {Object.keys(NODES).length} components
              &nbsp;·&nbsp; Select any block to read about it
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
