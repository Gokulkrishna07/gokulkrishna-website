import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import TechIcon from "../components/TechIcon";
import { PROJECTS, getProject } from "../data/projects";
import { useEffect } from "react";
import { track } from "../lib/analytics";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) track("Project Viewed", { slug: project.slug, title: project.title });
  }, [project]);

  if (!project) return <Navigate to="/projects" replace />;

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const Icon = project.icon;

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />

      <section className="px-6 pb-20 pt-8 sm:px-10 lg:px-16 lg:pt-12">
        <Link
          to="/projects"
          className="group inline-flex animate-fade-up items-center gap-2 font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          All Projects
        </Link>

        <div className="mt-10 flex animate-fade-up items-center gap-4">
          <Icon className="h-8 w-8 text-white/60" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/60 sm:text-sm">
            {project.category}
          </span>
        </div>

        <h1 className="mt-6 max-w-4xl animate-fade-up-delay-1 font-podium text-[clamp(2.2rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white">
          {project.title}
        </h1>

        <p className="mt-8 max-w-3xl animate-fade-up-delay-2 font-inter text-base leading-relaxed text-white/70 sm:text-lg">
          {project.overview}
        </p>

        <div className="mt-14 grid animate-fade-up-delay-3 gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
              What I Did
            </h2>

            <ul className="mt-6 space-y-5 border-t border-white/10 pt-6">
              {project.responsibilities.map((item, i) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-0.5 font-inter text-xs tabular-nums text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-inter text-sm leading-relaxed text-white/70 sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-10">
            <div>
              <h2 className="font-inter text-xs uppercase tracking-widest text-white/40">
                Outcome
              </h2>
              <p className="mt-3 font-inter text-lg font-bold uppercase leading-snug tracking-tight text-white sm:text-xl">
                {project.metric}
              </p>
            </div>

            <div>
              <h2 className="font-inter text-xs uppercase tracking-widest text-white/40">Stack</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="flex items-center gap-2 border border-white/15 px-3 py-1.5 font-inter text-[11px] uppercase tracking-wider text-white/70"
                  >
                    <TechIcon name={tag} className="h-4 w-4" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10 sm:gap-6">
          <Link
            to={`/projects/${next.slug}`}
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            Next: {next.title}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/contact"
            className="font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
