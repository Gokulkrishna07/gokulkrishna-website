import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import TechIcon from "../components/TechIcon";
import PodiumText from "../components/PodiumText";
import { getPost } from "../data/posts";
import { useEffect } from "react";
import { track } from "../lib/analytics";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (post && post.status === "published") {
      track("Blog Post Read", { slug: post.slug, title: post.title });
    }
  }, [post]);

  if (!post || post.status !== "published") return <Navigate to="/blog" replace />;

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />

      <section className="mx-auto w-full max-w-[46rem] px-6 pb-24 pt-8 sm:px-8 lg:pt-14">
        <Link
          to="/blog"
          className="group inline-flex animate-fade-up items-center gap-2 font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          All Posts
        </Link>

        <p className="mt-10 animate-fade-up font-inter text-xs uppercase tracking-[0.3em] text-white/50">
          {post.date}
        </p>

        <h1 className="mt-4 animate-fade-up-delay-1 font-podium text-[clamp(2.1rem,5vw,3.6rem)] uppercase leading-[1] tracking-tight text-white">
          {post.title}
        </h1>

        <ul className="mt-6 flex animate-fade-up-delay-2 flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-2 border border-white/15 px-2.5 py-1 font-inter text-[10px] uppercase tracking-wider text-white/55"
            >
              <TechIcon name={tag} />
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-10 animate-fade-up-delay-3 border-t border-white/10 pt-10">
          {post.content.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="mt-14 font-podium text-2xl uppercase tracking-tight text-white first:mt-0 sm:text-3xl"
                >
                  <PodiumText>{block.text}</PodiumText>
                </h2>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={i} className="mt-6 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[9px] h-1 w-1 shrink-0 bg-white/40" />
                      <span className="font-inter text-[1.0625rem] leading-[1.75] text-white/65">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              );
            }

            if (block.type === "verdict") {
              return (
                <p
                  key={i}
                  className="mt-8 border-l-2 border-white/40 pl-5 font-inter text-[1.0625rem] leading-[1.7] text-white/90"
                >
                  {block.text}
                </p>
              );
            }

            return (
              <p key={i} className="mt-6 font-inter text-[1.0625rem] leading-[1.75] text-white/70">
                {block.text}
              </p>
            );
          })}

          {post.embed && (
            <figure className="mt-14 border-t border-white/10 pt-10">
              <figcaption className="mb-4 font-inter text-[10px] uppercase tracking-widest text-white/35">
                The original carousel
              </figcaption>
              <iframe
                src={post.embed}
                title={`${post.title} — LinkedIn carousel`}
                loading="lazy"
                allowFullScreen
                className="h-[560px] w-full rounded-lg border border-white/10 bg-white/[0.02] sm:h-[620px]"
              />
            </figure>
          )}

          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("Blog Source Opened", { slug: post.slug })}
              className="group mt-14 inline-flex items-center gap-2 border-t border-white/10 pt-8 font-inter text-xs uppercase tracking-widest text-white/45 transition-colors hover:text-white"
            >
              Originally posted on LinkedIn
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10 sm:gap-6">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            Get in Touch
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/blog"
            className="font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
          >
            &larr; All Posts
          </Link>
        </div>
      </section>
    </main>
  );
}
