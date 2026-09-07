import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Cloud,
  Database,
  GitBranch,
  Network,
  Sparkles,
  Wrench,
} from "lucide-react";
import Navbar from "../components/Navbar";

const SKILL_GROUPS = [
  {
    icon: Cloud,
    title: "Cloud Platforms",
    skills: ["AWS (EC2, S3, Lambda, API Gateway)", "DigitalOcean (DOKS)", "Azure", "Proxmox VE"],
  },
  {
    icon: Boxes,
    title: "Containers and Orchestration",
    skills: ["Docker", "Kubernetes (K8s)", "Helm Charts"],
  },
  {
    icon: GitBranch,
    title: "IaC and Pipelines",
    skills: ["Terraform", "GitHub Actions", "CI/CD Pipeline Design"],
  },
  {
    icon: Activity,
    title: "Monitoring and Observability",
    skills: ["Prometheus", "Grafana", "SonarQube", "Slack and Microsoft Teams Alerting"],
  },
  {
    icon: Network,
    title: "Networking and API Management",
    skills: ["Nginx (Reverse Proxy)", "APISIX", "AWS API Gateway"],
  },
  {
    icon: Database,
    title: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Cassandra"],
  },
  {
    icon: Sparkles,
    title: "AI Assisted DevOps",
    skills: ["Claude Code", "Agentic AI Workflows", "MLOps (Basics)"],
  },
  {
    icon: Wrench,
    title: "Tools and Practices",
    skills: ["Git", "GitHub", "GitLab", "Jira", "Linux", "Agile"],
  },
];

export default function Skills() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />

      <section className="px-6 pb-20 pt-8 sm:px-10 lg:px-16 lg:pt-12">
        <div className="mb-4 flex animate-fade-up items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            What I Work With
          </span>
        </div>

        <h1 className="animate-fade-up-delay-1 font-podium text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.92] tracking-tight text-white">
          Skills
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up-delay-2 font-inter text-sm leading-relaxed text-white/60 sm:text-base">
          The stack I use to deploy, automate and observe production systems &mdash; from container
          orchestration and infrastructure as code through to gateways, databases and alerting.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {SKILL_GROUPS.map((group, i) => {
            const Icon = group.icon;
            return (
              <article
                key={group.title}
                className="group animate-fade-up bg-neutral-950 p-6 transition-colors hover:bg-neutral-900 sm:p-8"
                style={{ animationDelay: `${0.12 * i + 0.3}s` }}
              >
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-white/60 transition-colors group-hover:text-white" />
                  <span className="font-inter text-[10px] tabular-nums tracking-widest text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="mt-6 font-podium text-xl uppercase leading-tight tracking-tight text-white sm:text-2xl">
                  {group.title}
                </h2>

                <ul className="mt-5 space-y-2.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-start gap-2.5 font-inter text-sm leading-snug text-white/60"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-white/40" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            See These in Action
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/"
            className="font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
          >
            &larr; Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
