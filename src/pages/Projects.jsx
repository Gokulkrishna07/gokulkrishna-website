import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import TechIcon from "../components/TechIcon";
import { PROJECTS } from "../data/projects";
import { useSEO } from "../lib/seo";

export default function Projects() {
  useSEO({
    title: "Projects — Gokulkrishna A B",
    description:
      "Cloud and DevOps projects by Gokulkrishna A B: Kubernetes microservices platforms, CI/CD pipelines, API gateways and infrastructure automation shipped to production.",
    path: "/projects",
  });

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />

      <section className="px-6 pb-20 pt-8 sm:px-10 lg:px-16 lg:pt-12">
        <div className="mb-4 flex animate-fade-up items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            Selected Work
          </span>
        </div>

        <h1 className="animate-fade-up-delay-1 font-podium text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.92] tracking-tight text-white">
          Projects
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up-delay-2 font-inter text-sm leading-relaxed text-white/60 sm:text-base">
          Production platforms I&apos;ve deployed, automated and kept running &mdash; across managed
          Kubernetes, AWS and self-hosted infrastructure. Client names are withheld; the engineering
          is not.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:mt-16 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project, i) => {
            const Icon = project.icon;
            return (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group flex animate-fade-up flex-col bg-neutral-950 p-6 transition-colors hover:bg-neutral-900 sm:p-8"
                style={{ animationDelay: `${0.15 * i + 0.3}s` }}
              >
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-white/60 transition-colors group-hover:text-white" />
                  <span className="font-inter text-[10px] tabular-nums tracking-widest text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="mt-6 font-podium text-2xl uppercase leading-tight tracking-tight text-white sm:text-3xl">
                  {project.title}
                </h2>

                <p className="mt-2 font-inter text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                  {project.category}
                </p>

                <p className="mt-4 font-inter text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>

                <p className="mt-5 font-inter text-xs font-semibold uppercase tracking-wider text-white/80">
                  {project.metric}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="flex items-center gap-1.5 border border-white/15 px-2.5 py-1 font-inter text-[10px] uppercase tracking-wider text-white/60"
                    >
                      <TechIcon name={tag} />
                      {tag}
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-2 font-inter text-[10px] uppercase tracking-widest text-white/40 transition-colors group-hover:text-white">
                  Read More
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            Work With Me
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
