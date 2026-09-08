import { Link } from "react-router-dom";
import { ArrowUpRight, Crown } from "lucide-react";
import Navbar from "../components/Navbar";
import PipelineSimulator from "../components/PipelineSimulator";
import TechMarquee from "../components/TechMarquee";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import { useSEO } from "../lib/seo";

const STATS = [
  { value: "2+", label: "Years Experience" },
  { value: "6+", label: "Microservices Deployed" },
  { value: "60%", label: "Manual Effort Cut" },
];

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4";

export default function Home() {
  useSEO({
    title: "Gokulkrishna A B — Cloud & DevOps Engineer",
    description:
      "Gokulkrishna A B is a Cloud and DevOps engineer based in Ernakulam, Kerala, India, working with Kubernetes, Docker, Terraform, GitHub Actions and AWS to build and ship production infrastructure.",
    path: "/",
  });

  return (
    <main className="bg-neutral-950">
      <div className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/50" />

        <Navbar />

        <section className="relative z-30 flex h-[calc(100%-5.5rem)] flex-col justify-center px-6 pb-10 sm:px-10 lg:h-[calc(100%-6.5rem)] lg:px-16">
          <div className="mb-6 flex animate-fade-up items-center gap-3 lg:mb-8">
            <Crown className="h-4 w-4 text-accent" />
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
              Cloud &amp; DevOps Engineer
            </span>
          </div>

          <h1 className="animate-fade-up-delay-1 font-podium uppercase leading-[0.92] tracking-tight text-white">
            <span className="block text-[clamp(2.8rem,8vw,7rem)]">Deploy.</span>
            <span className="block text-[clamp(2.8rem,8vw,7rem)]">
              Automate.
            </span>
            <span className="block text-[clamp(2.8rem,8vw,7rem)]">Scale.</span>
          </h1>

          <p className="mt-6 max-w-md animate-fade-up-delay-2 font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
            I build resilient cloud infrastructure and CI/CD pipelines
            <br />
            that don&apos;t just ship code &mdash;{" "}
            <span className="font-bold text-white">they scale.</span>
          </p>

          <div className="mt-8 flex animate-fade-up-delay-3 flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 bg-black px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
            >
              View My Work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-8 flex animate-fade-up-delay-4 flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-1 font-inter text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TechMarquee />

      <AboutSection />

      <ArchitectureDiagram />

      <PipelineSimulator />

      <ExperienceSection />

      {/* Closing CTA */}
      <section className="border-t border-white/10 bg-neutral-950 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
                Open To Work
              </span>
            </div>

            <h2 className="mt-4 font-podium text-[clamp(2rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-tight text-white">
              <span className="block">Have Infra</span>
              <span className="block">That Needs</span>
              <span className="block">Scaling?</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 bg-white px-7 py-4 font-inter text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/90"
            >
              Get in Touch
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/projects"
              className="font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
            >
              See My Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
