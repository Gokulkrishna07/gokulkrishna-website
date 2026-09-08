import { Link } from "react-router-dom";
import { ArrowUpRight, PenLine } from "lucide-react";
import Navbar from "../components/Navbar";
import TechIcon from "../components/TechIcon";
import { POSTS } from "../data/posts";
import { useSEO } from "../lib/seo";

function Meta({ post }) {
  return (
    <span className="flex items-center gap-3 font-inter text-[10px] uppercase tracking-widest">
      {post.status === "published" ? (
        <span className="text-white/40">{post.date}</span>
      ) : (
        <span className="border border-white/20 px-2 py-0.5 text-white/40">Coming soon</span>
      )}
    </span>
  );
}

function Tags({ tags, className = "" }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="flex items-center gap-2 border border-white/15 px-2.5 py-1 font-inter text-[10px] uppercase tracking-wider text-white/55"
        >
          <TechIcon name={tag} />
          {tag}
        </li>
      ))}
    </ul>
  );
}

function Wrapper({ post, children, className }) {
  return post.status === "published" ? (
    <Link to={`/blog/${post.slug}`} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export default function Blog() {
  const [featured, ...rest] = POSTS;

  useSEO({
    title: "Blog — Gokulkrishna A B",
    description:
      "Writing on DevOps, Kubernetes, LLMOps and cloud infrastructure by Gokulkrishna A B, Cloud and DevOps engineer based in Ernakulam, Kerala, India.",
    path: "/blog",
  });

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />

      <section className="px-6 pb-20 pt-8 sm:px-10 lg:px-16 lg:pt-12">
        <div className="mb-4 flex animate-fade-up items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            Notes From Production
          </span>
        </div>

        <h1 className="animate-fade-up-delay-1 font-podium text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.92] tracking-tight text-white">
          Blog
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up-delay-2 font-inter text-sm leading-relaxed text-white/60 sm:text-base">
          Write ups on the infrastructure problems I have actually had to solve &mdash; migrations,
          gateways, pipelines and the alerts that wake people up. These are the pieces I am working
          on next.
        </p>

        {/* Featured */}
        <Wrapper
          post={featured}
          className="group mt-14 block border border-white/12 bg-white/[0.02] p-7 transition-colors hover:bg-white/[0.04] sm:mt-16 sm:p-10"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2 font-inter text-[10px] uppercase tracking-widest text-accent">
              <PenLine className="h-3.5 w-3.5" />
              Latest
            </span>
            <Meta post={featured} />
          </div>

          <h2 className="mt-5 max-w-3xl font-podium text-[clamp(1.8rem,4vw,3rem)] uppercase leading-[1.05] tracking-tight text-white">
            {featured.title}
          </h2>

          <p className="mt-5 max-w-2xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
            {featured.summary}
          </p>

          <Tags tags={featured.tags} className="mt-6" />
        </Wrapper>

        {/* Rest */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rest.map((post) => (
            <Wrapper
              key={post.slug}
              post={post}
              className="group flex flex-col border border-white/12 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]"
            >
              <Meta post={post} />

              <h2 className="mt-4 font-podium text-xl uppercase leading-tight tracking-tight text-white sm:text-2xl">
                {post.title}
              </h2>

              <p className="mt-3 flex-1 font-inter text-sm leading-relaxed text-white/55">
                {post.summary}
              </p>

              <Tags tags={post.tags} className="mt-5" />
            </Wrapper>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            Want one of these sooner? Tell me
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
