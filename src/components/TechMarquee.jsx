import TechIcon from "./TechIcon";

const STACK = [
  "Kubernetes",
  "Docker",
  "Terraform",
  "GitHub Actions",
  "AWS",
  "Grafana",
  "Prometheus",
  "Nginx",
  "Helm",
  "APISIX",
  "SonarQube",
  "Cassandra",
  "Linux",
];

export default function TechMarquee() {
  const row = [...STACK, ...STACK];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-6">
      <div className="flex w-max animate-marquee items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
        {row.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="flex shrink-0 items-center gap-3 font-inter text-sm uppercase tracking-widest text-white/45"
          >
            <TechIcon name={tech} className="h-5 w-5" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
