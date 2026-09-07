import { Building2, Car, Dumbbell, KeyRound, ScanFace, ShieldCheck } from "lucide-react";

export const PROJECTS = [
  {
    slug: "car-dealer-management-platform",
    icon: Car,
    title: "Car Dealer Management Platform",
    category: "Automotive · Microservices",
    description:
      "A dealership management platform built as a microservices architecture, including AI/ML services, running on managed Kubernetes. I own the deployment, gateway routing and release automation across environments.",
    metric: "6+ microservices in production",
    tags: ["Kubernetes", "Docker", "APISIX", "GitHub Actions", "Grafana"],
    overview:
      "A management platform for automotive dealerships, built as a microservices architecture that includes AI/ML services alongside the core business services. It runs on DigitalOcean Kubernetes Service, and the service count is actively growing as new capabilities ship. My role covers the whole path from cluster to production traffic: how services are deployed, how requests are routed and secured, how releases reach each environment, and how the running system is observed.",
    responsibilities: [
      "Deploy and manage the microservices platform — including its AI/ML services — on DigitalOcean Kubernetes Service (DOKS), currently running 6+ microservices with the count actively growing.",
      "Deployed and manage a self-hosted APISIX API gateway to route and secure traffic across the microservices architecture.",
      "Built CI/CD pipelines using GitHub Actions to automate build and deployment workflows across environments.",
      "Set up monitoring using Grafana with Slack alerts, giving the team real-time visibility into system health.",
    ],
  },
  {
    slug: "health-and-fitness-platform",
    icon: Dumbbell,
    title: "Health and Fitness Platform",
    category: "Mobile · Multi-App Product",
    description:
      "A fitness product spanning member and partner mobile apps, an admin console and backend services. I maintain the containerized services and the build and release pipelines that ship each app.",
    metric: "Multi-app release pipeline",
    tags: ["Docker", "CI/CD", "GitHub Actions", "Kubernetes"],
    overview:
      "A fitness product made up of several surfaces rather than a single app: a member-facing mobile app, a separate partner app for the gyms and trainers on the platform, an admin web console, and the backend services behind all of them. Each surface ships on its own cadence, so the work is as much about repeatable release tooling as it is about the infrastructure underneath.",
    responsibilities: [
      "Maintain the containerized backend services that the mobile apps and admin console depend on.",
      "Build and maintain the CI/CD pipelines that build and release each app in the product family.",
      "Keep environments consistent across the separate member, partner and admin surfaces.",
    ],
  },
  {
    slug: "rental-property-platform",
    icon: Building2,
    title: "Rental Property Platform",
    category: "PropTech · Cloud Migration",
    description:
      "A platform for discovering rental homes and buildings, first hosted on a private virtualized server behind a reverse proxy, then migrated to AWS with infrastructure as code. I led the environment progression from dev toward staging.",
    metric: "On-prem → AWS migration",
    tags: ["Terraform", "AWS EC2", "Nginx", "Prometheus", "Grafana"],
    overview:
      "A platform where people find rental homes and buildings. It started life on a private virtualized server and is now moving to AWS, so the interesting part of this project is the migration itself: reproducing a hand-built on-premises environment as code, standing it up on AWS, and then walking it forward one environment at a time rather than cutting over in a single risky step.",
    responsibilities: [
      "Deployed and hosted the platform on a private virtualized server using Proxmox, and configured Nginx as a reverse proxy for production traffic.",
      "Migrated the application infrastructure from on-premises Proxmox to AWS using Terraform for infrastructure as code, provisioning and configuring EC2 instances for the development environment.",
      "Built CI/CD pipelines using GitHub Actions for the migrated AWS environment, with Teams webhook alerts on build and deployment failures.",
      "Implemented Prometheus and Grafana for real-time monitoring and observability.",
      "Leading the environment progression from dev to staging as part of the ongoing AWS migration.",
    ],
  },
  {
    slug: "secrets-management-platform",
    icon: KeyRound,
    title: "Secrets Management Platform",
    category: "Security · Kubernetes",
    description:
      "A credential vault architected and deployed on a self-managed Kubernetes cluster, with Helm charts handling application packaging and releases and a clustered database backing storage.",
    metric: "Security scanning on every commit",
    tags: ["Kubernetes", "Helm", "Cassandra", "SonarQube", "GitHub Actions"],
    overview:
      "A vault for storing and serving credentials. Because of what it holds, it runs on a self-managed Kubernetes cluster rather than a managed service, which meant architecting the cluster as well as the application on top of it. Releases are packaged with Helm, storage is backed by a clustered database inside the cluster, and every commit is scanned before it can progress.",
    responsibilities: [
      "Architected and deployed the platform on a self-managed Kubernetes cluster hosted on Proxmox, using Helm charts to manage application packaging and releases.",
      "Deployed and managed a Cassandra database within the cluster to support application data storage.",
      "Built CI/CD pipelines using GitHub Actions to automate build and deployment workflows for the cluster, with Teams webhook alerts on CD failures.",
      "Implemented SonarQube to automate security and quality scanning on every commit, removing manual code review bottlenecks.",
    ],
  },
  {
    slug: "governance-risk-and-compliance-platform",
    icon: ShieldCheck,
    title: "Governance, Risk and Compliance Platform",
    category: "Enterprise · Infrastructure",
    description:
      "Provisioned and managed the infrastructure behind a compliance platform, automating environment setup so new environments no longer needed hand-built deployment steps.",
    metric: "~60% less manual deployment effort",
    tags: ["Infrastructure as Code", "CI/CD", "Linux"],
    overview:
      "An enterprise governance, risk and compliance platform. The problem here was not the application but the cost of standing it up: every new environment was being assembled by hand. Automating that setup removed the repeated manual work and made environments predictable, cutting the manual deployment effort by roughly 60%.",
    responsibilities: [
      "Provisioned and managed the infrastructure for the platform.",
      "Automated environment setup so new environments no longer required hand-built deployment steps.",
      "Cut manual deployment effort by approximately 60%.",
    ],
  },
  {
    slug: "ai-powered-attendance-system",
    icon: ScanFace,
    title: "AI Powered Attendance System",
    category: "AI · Internal Tooling",
    description:
      "An AI-driven attendance system deployed on AWS, replacing manual attendance tracking and cutting the administrative overhead that came with it.",
    metric: "Manual tracking eliminated",
    tags: ["AWS", "Docker", "CI/CD"],
    overview:
      "An internal tool that replaced manual attendance tracking with an AI-driven system. Attendance had been an administrative chore that consumed staff time and produced records only as reliable as whoever was keeping them. Deploying this on AWS removed the manual step entirely, along with the overhead that came with chasing and correcting it.",
    responsibilities: [
      "Deployed the AI-powered attendance system on AWS.",
      "Eliminated manual attendance tracking and the administrative overhead it created.",
    ],
  },
];

export function getProject(slug) {
  return PROJECTS.find((project) => project.slug === slug);
}
