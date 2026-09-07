import {
  siApachecassandra,
  siDocker,
  siGithubactions,
  siGrafana,
  siHelm,
  siKubernetes,
  siLinux,
  siNginx,
  siPrometheus,
  siSonarqubeserver,
  siTerraform,
} from "simple-icons";
import { Cloud, FileCode2, GitBranch, Network } from "lucide-react";

const BRAND = {
  Kubernetes: siKubernetes,
  Docker: siDocker,
  "GitHub Actions": siGithubactions,
  Grafana: siGrafana,
  Terraform: siTerraform,
  Nginx: siNginx,
  Prometheus: siPrometheus,
  Helm: siHelm,
  Cassandra: siApachecassandra,
  SonarQube: siSonarqubeserver,
  Linux: siLinux,
};

// No brand mark exists in simple-icons for these (Amazon marks were withdrawn,
// APISIX was never added), so they fall back to a neutral glyph.
const FALLBACK = {
  APISIX: Network,
  "AWS EC2": Cloud,
  AWS: Cloud,
  "CI/CD": GitBranch,
  "Infrastructure as Code": FileCode2,
};

// Brand marks are drawn on a near-black page, so very dark logos (Helm's navy,
// GitHub's near-black) disappear. Lift those toward white instead of shipping an
// invisible icon.
function displayColor(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luminance >= 0.22) return `#${hex}`;

  const lift = (c) => Math.round(255 * (c + (1 - c) * 0.55));
  return `rgb(${lift(r)}, ${lift(g)}, ${lift(b)})`;
}

export default function TechIcon({ name, className = "h-3.5 w-3.5" }) {
  const brand = BRAND[name];

  if (brand) {
    return (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill={displayColor(brand.hex)}
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const Fallback = FALLBACK[name];
  if (!Fallback) return null;

  return <Fallback className={`${className} shrink-0 text-white/50`} aria-hidden="true" />;
}
