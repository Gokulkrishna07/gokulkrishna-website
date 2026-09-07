import { Award, GraduationCap } from "lucide-react";

const ROLE = {
  company: "Edstem Technologies",
  title: "Junior Software Engineer",
  period: "Nov 2024 — Present",
  points: [
    "Deploy and manage a microservices dealership platform on DigitalOcean Kubernetes, including its AI/ML services, behind a self hosted APISIX gateway.",
    "Migrated a production platform from on premises Proxmox to AWS using Terraform, and lead its environment progression from dev toward staging.",
    "Architected a credential vault on a self managed Kubernetes cluster, packaged with Helm and backed by a Cassandra cluster.",
    "Build the GitHub Actions pipelines behind these platforms, with Prometheus and Grafana monitoring and Slack or Teams alerts on failure.",
  ],
};

const EDUCATION = {
  degree: "B.Tech in Computer Science",
  school: "Kerala Technological University — College of Engineering Adoor",
  period: "2020 — 2024",
};

const CERTIFICATIONS = [
  { name: "Claude Code in Action", issuer: "Anthropic Education", date: "Mar 2026" },
  { name: "Agent Skills with Anthropic", issuer: "DeepLearning.AI x Anthropic", date: "Feb 2026" },
  { name: "Agentic AI", issuer: "DeepLearning.AI", date: "Feb 2026" },
  {
    name: "LangChain for LLM Application Development",
    issuer: "DeepLearning.AI x LangChain",
    date: "Feb 2026",
  },
  { name: "Claude 101", issuer: "Anthropic Education", date: "Feb 2026" },
  { name: "Decoding DevOps — Basics to Advanced with AI", issuer: "Udemy", date: "2025" },
  { name: "Microsoft Azure AI Fundamentals (AI-900)", issuer: "Microsoft", date: "2024" },
  { name: "Git, GitLab and GitHub Fundamentals", issuer: "Udemy", date: "Sept 2024" },
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-white/10 bg-neutral-950 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
          Where I Have Been
        </span>
      </div>

      <h2 className="mt-4 font-podium text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white">
        Experience
      </h2>

      <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-16">
        {/* Role */}
        <div className="lg:col-span-2">
          <div className="border-l-2 border-accent/70 pl-6 sm:pl-8">
            <p className="font-inter text-xs uppercase tracking-widest text-white/40">
              {ROLE.period}
            </p>

            <h3 className="mt-2 font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
              {ROLE.company}
            </h3>

            <p className="mt-1 font-inter text-sm text-white/60 sm:text-base">{ROLE.title}</p>

            <ul className="mt-6 space-y-4">
              {ROLE.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                  <span className="font-inter text-sm leading-relaxed text-white/65">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="border border-white/10 p-6">
            <GraduationCap className="h-7 w-7 text-white/50" />

            <p className="mt-5 font-inter text-xs uppercase tracking-widest text-white/40">
              {EDUCATION.period}
            </p>

            <h3 className="mt-2 font-inter text-base font-semibold leading-snug text-white">
              {EDUCATION.degree}
            </h3>

            <p className="mt-2 font-inter text-sm leading-relaxed text-white/55">
              {EDUCATION.school}
            </p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-20">
        <div className="flex items-center gap-3">
          <Award className="h-5 w-5 text-white/50" />
          <h3 className="font-podium text-xl uppercase tracking-tight text-white sm:text-2xl">
            Certifications
          </h3>
          <span className="font-inter text-xs text-white/30">{CERTIFICATIONS.length}</span>
        </div>

        <div className="mt-6 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.name} className="bg-neutral-950 p-5 transition-colors hover:bg-white/[0.04]">
              <p className="font-inter text-[10px] uppercase tracking-widest text-white/35">
                {cert.date}
              </p>

              <p className="mt-3 font-inter text-sm font-medium leading-snug text-white/90">
                {cert.name}
              </p>

              <p className="mt-2 font-inter text-xs text-white/45">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
