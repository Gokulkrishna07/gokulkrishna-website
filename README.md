# Gokulkrishna A B

Junior Software Engineer — Kerala, India

[gokulkrishna.website](https://gokulkrishna.website) · [gokulkrishnaab7@gmail.com](mailto:gokulkrishnaab7@gmail.com) · [github.com/Gokulkrishna07](https://github.com/Gokulkrishna07) · [linkedin.com/in/gokulkrishna-a-b-b9a455262](https://linkedin.com/in/gokulkrishna-a-b-b9a455262)

This repo is the source for my personal portfolio site — built with React 19, Vite, and Tailwind, and doubling here as a running resume.

## Experience

**Edstem Technologies** — Junior Software Engineer · Nov 2024 — Present
- Deploy and manage a microservices dealership platform on DigitalOcean Kubernetes, including its AI/ML services, behind a self-hosted APISIX gateway.
- Migrated a production platform from on-premises Proxmox to AWS using Terraform, leading its environment progression from dev toward staging.
- Architected a credential vault on a self-managed Kubernetes cluster, packaged with Helm and backed by a Cassandra cluster.
- Built the GitHub Actions pipelines behind these platforms, with Prometheus and Grafana monitoring and Slack/Teams alerts on failure.

## Skills

Kubernetes · Docker · Terraform · GitHub Actions · AWS · Grafana · Prometheus · Nginx · Helm · APISIX · SonarQube · Cassandra · Linux · React · React Native · TypeScript · Node.js

## Education

**B.Tech in Computer Science** — Kerala Technological University, College of Engineering Adoor · 2020 — 2024

## Certifications

- Claude Code in Action — Anthropic Education (Mar 2026)
- Agent Skills with Anthropic — DeepLearning.AI x Anthropic (Feb 2026)
- Agentic AI — DeepLearning.AI (Feb 2026)
- LangChain for LLM Application Development — DeepLearning.AI x LangChain (Feb 2026)
- Claude 101 — Anthropic Education (Feb 2026)
- Decoding DevOps — Basics to Advanced with AI — Udemy (2025)
- Microsoft Azure AI Fundamentals (AI-900) — Microsoft (2024)
- Git, GitLab and GitHub Fundamentals — Udemy (Sept 2024)

## This project

- **Stack:** React 19, Vite, Tailwind CSS, Framer Motion, React Router
- **Testing:** Vitest + Testing Library, 100% coverage thresholds
- **Chat API:** `api/` — an Express server proxying to a hosted RouteAI backend, deployed separately from the static frontend
- **Deploy:** GitHub Actions CI/CD → nginx + Cloudflare Tunnel on a self-hosted Debian box

### Local development

```bash
npm install
npm run dev
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Lint with Oxlint |
| `npm test` | Run the test suite once |
| `npm run coverage` | Run tests with coverage report |
