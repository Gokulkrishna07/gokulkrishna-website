import { Link } from "react-router-dom";
import { ArrowUpRight, Briefcase, Code2, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import { track } from "../lib/analytics";
import { useSEO } from "../lib/seo";

const EMAIL = "gokulkrishnaab7@gmail.com";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9037363277",
    href: "tel:+919037363277",
  },
  {
    icon: Briefcase,
    label: "LinkedIn",
    value: "linkedin.com/in/gokulkrishna-a-b-b9a455262",
    href: "https://linkedin.com/in/gokulkrishna-a-b-b9a455262",
  },
  {
    icon: Code2,
    label: "GitHub",
    value: "github.com/Gokulkrishna07",
    href: "https://github.com/Gokulkrishna07",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Ernakulam, Kerala, India",
  },
];

export default function Contact() {
  useSEO({
    title: "Contact — Gokulkrishna A B",
    description:
      "Get in touch with Gokulkrishna A B, Cloud and DevOps engineer based in Ernakulam, Kerala, India. Email, phone, LinkedIn and GitHub.",
    path: "/contact",
  });

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />

      <section className="px-6 pb-20 pt-8 sm:px-10 lg:px-16 lg:pt-12">
        <div className="mb-4 flex animate-fade-up items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            Get In Touch
          </span>
        </div>

        <h1 className="animate-fade-up-delay-1 font-podium text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.92] tracking-tight text-white">
          Contact
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up-delay-2 font-inter text-sm leading-relaxed text-white/60 sm:text-base">
          Have infrastructure that needs deploying, automating or rescuing? Email is the fastest way
          to reach me &mdash; I read everything that lands there.
        </p>

        <div className="mt-12 animate-fade-up-delay-3 border-t border-white/10 sm:mt-16">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            const isLink = Boolean(channel.href);
            const external = channel.href?.startsWith("http");

            const inner = (
              <>
                <Icon className="h-6 w-6 shrink-0 text-white/50 transition-colors group-hover:text-white sm:h-7 sm:w-7" />

                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                  <span className="font-inter text-[10px] uppercase tracking-widest text-white/40 sm:w-28 sm:shrink-0 sm:text-xs">
                    {channel.label}
                  </span>

                  <span className="min-w-0 break-all font-inter text-sm text-white/80 transition-colors group-hover:text-white sm:break-words sm:text-base">
                    {channel.value}
                  </span>
                </span>

                {isLink && (
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                )}
              </>
            );

            const classes =
              "group flex items-center gap-4 border-b border-white/10 px-2 py-5 transition-colors sm:gap-6 sm:px-4 sm:py-7";

            return isLink ? (
              <a
                key={channel.label}
                href={channel.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                onClick={() => track("Contact Channel Used", { channel: channel.label })}
                className={`${classes} hover:bg-white/5`}
              >
                {inner}
              </a>
            ) : (
              <div key={channel.label} className={classes}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex animate-fade-up-delay-4 flex-wrap items-center gap-4 sm:gap-6">
          <a
            href={`mailto:${EMAIL}`}
            className="group inline-flex items-center gap-2 bg-white px-6 py-4 font-inter text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/90"
          >
            Email Me
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <Link
            to="/projects"
            className="font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
          >
            See My Work
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
