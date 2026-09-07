import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";

export const NAV_LINKS = [
  { label: "Projects", to: "/projects" },
  { label: "Blog", to: "/blog" },
  { label: "Skills", to: "/skills" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="relative z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        <Link
          to="/"
          className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
        >
          Gokulkrishna
        </Link>

        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="font-inter text-sm uppercase tracking-widest text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/contact"
          className="hidden items-center gap-2 border border-white/30 px-6 py-3 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10 md:flex"
        >
          Get in Touch
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="space-y-1.5 md:hidden"
        >
          <div className="h-0.5 w-6 bg-white" />
          <div className="h-0.5 w-6 bg-white" />
          <div className="h-0.5 w-4 bg-white" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <span className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
            Gokulkrishna
          </span>
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X className="h-7 w-7 text-white" />
          </button>
        </div>

        <div className="flex h-[calc(100%-6rem)] flex-col justify-center gap-5 px-6 sm:px-10">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl uppercase text-white sm:text-5xl"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: `${i * 80 + 100}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex w-fit items-center gap-2 border border-white/30 px-6 py-3 font-inter text-xs uppercase tracking-widest text-white"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
            }}
          >
            Get in Touch
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
