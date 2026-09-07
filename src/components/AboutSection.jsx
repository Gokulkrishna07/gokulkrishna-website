import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, MapPin } from "lucide-react";
import { track } from "../lib/analytics";

// Save the photos into public/assets/ with these names and they appear automatically.
const RAIL = [
  {
    type: "photo",
    src: "/assets/ride.jpg",
    caption: "On the road",
    ratio: "4 / 5",
    alt: "Gokulkrishna standing beside his motorcycle",
  },
  {
    type: "photo",
    src: "/assets/doorway.jpg",
    caption: "First light",
    ratio: "3 / 4",
    alt: "Gokulkrishna silhouetted in a doorway on a misty morning",
  },
  {
    type: "photo",
    src: "/assets/heritage.jpg",
    caption: "Off duty",
    ratio: "9 / 16",
    alt: "Gokulkrishna seated in a courtyard",
  },
  {
    type: "photo",
    src: "/assets/viewpoint.jpg",
    caption: "High ground",
    ratio: "3 / 4",
    alt: "Gokulkrishna at a hilltop viewpoint",
  },
  {
    type: "photo",
    src: "/assets/hills.jpg",
    caption: "Room to think",
    ratio: "16 / 9",
    alt: "Gokulkrishna standing against misty hills",
  },
  {
    type: "photo",
    src: "/assets/harbour-night.jpg",
    caption: "Night on the water",
    ratio: "9 / 16",
    alt: "Gokulkrishna on a boat at night",
  },
  {
    type: "map",
    src: "/assets/map-ernakulam.jpg",
  },
  {
    type: "photo",
    src: "/assets/sea.jpg",
    caption: "Out at sea",
    ratio: "9 / 16",
    alt: "Gokulkrishna looking out over the sea",
  },
  {
    type: "photo",
    src: "/assets/beach.jpg",
    caption: "Black sand",
    ratio: "16 / 9",
    alt: "Gokulkrishna walking toward the surf on a black sand beach",
  },
];

function Photo({ item, index }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className="group relative h-full shrink-0 overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10"
      style={{ aspectRatio: item.ratio }}
    >
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-white/15 p-6 text-center">
          <Camera className="h-7 w-7 text-white/25" />
          <span className="font-inter text-[10px] uppercase tracking-widest text-white/35">
            {item.src.replace("/assets/", "")}
          </span>
        </div>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          decoding="async"
          draggable="false"
          onError={() => setFailed(true)}
          className="h-full w-full select-none object-cover grayscale transition-all duration-[900ms] ease-out will-change-transform group-hover:scale-[1.06] group-hover:grayscale-0"
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 pt-16">
        <span className="block font-inter text-[10px] tabular-nums tracking-widest text-white/40">
          {String(index).padStart(2, "0")}
        </span>
        <span className="mt-1 block translate-y-2 font-podium text-xl uppercase tracking-tight text-white opacity-80 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-2xl">
          {item.caption}
        </span>
      </div>
    </figure>
  );
}

function MapCard({ item }) {
  return (
    <figure
      className="group relative h-full shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
      style={{ aspectRatio: "3 / 4" }}
    >
      <img
        src={item.src}
        alt="Map of Ernakulam, Kerala"
        decoding="async"
        draggable="false"
        className="h-full w-full select-none object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />

      {/* Ernakulam sits at roughly 31% / 73% of the tile block */}
      <span className="absolute" style={{ left: "31%", top: "73%" }}>
        <span className="relative flex h-3 w-3 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
        </span>
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 pt-16">
        <span className="flex items-center gap-2 font-inter text-[10px] uppercase tracking-widest text-white/45">
          <MapPin className="h-3.5 w-3.5" />
          Based in
        </span>
        <span className="mt-1 block font-podium text-xl uppercase tracking-tight text-white sm:text-2xl">
          Ernakulam, Kerala
        </span>
        <span className="mt-2 block font-inter text-[9px] text-white/25">
          Map data &copy; OpenStreetMap contributors
        </span>
      </div>
    </figure>
  );
}

export default function AboutSection() {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });
  const raf = useRef(0);

  function updateProgress() {
    const el = railRef.current;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }

  useEffect(() => {
    updateProgress();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // Native `behavior: "smooth"` gets cancelled on this container, so tween it by hand.
  function scrollByPage(dir) {
    const el = railRef.current;
    track("About Rail Scrolled", { direction: dir > 0 ? "next" : "previous" });

    cancelAnimationFrame(raf.current);

    const from = el.scrollLeft;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, from + dir * el.clientWidth * 0.75));
    const started = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - started) / 520);
      el.scrollLeft = from + (to - from) * (1 - Math.pow(1 - t, 3));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
  }

  function onPointerDown(e) {
    const el = railRef.current;
    if (e.pointerType === "touch") return;
    cancelAnimationFrame(raf.current);
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    const el = railRef.current;
    if (!drag.current.active) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  }

  function endDrag(e) {
    const el = railRef.current;
    drag.current.active = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  }

  return (
    <section
      id="about"
      className="scroll-mt-24 overflow-hidden border-t border-white/10 bg-neutral-950 py-20 lg:py-28"
    >
      {/* Intro */}
      <div className="px-6 sm:px-10 lg:px-16">
        <div className="flex animate-fade-up items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            Who You Are Hiring
          </span>
        </div>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <h2 className="animate-fade-up-delay-1 font-podium text-[clamp(2.4rem,8vw,6.5rem)] uppercase leading-[0.9] tracking-tight text-white">
            <span className="block">Gokulkrishna</span>
            <span className="block text-white/35">A B</span>
          </h2>

          <div className="animate-fade-up-delay-2 lg:pb-3">
            <p className="font-inter text-base leading-relaxed text-white/70 lg:text-lg">
              I build infrastructure that stays up. Containers that heal themselves, pipelines that
              catch problems before a human does, and monitoring that raises a hand long before a
              user would.
            </p>

            <p className="mt-4 font-inter text-sm leading-relaxed text-white/50">
              The last two years have been microservices on managed Kubernetes, an on premises to AWS
              migration built with Terraform, and the CI/CD that ships all of it. I like the problems
              that only show up at scale. Away from the terminal I am usually on the bike or
              somewhere near the water.
            </p>

            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal rail */}
      <div
        ref={railRef}
        onScroll={updateProgress}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="scrollbar-none mt-14 flex h-[330px] gap-4 overflow-x-auto px-6 sm:h-[420px] sm:gap-5 sm:px-10 lg:h-[480px] lg:px-16"
        style={{ cursor: "grab" }}
      >
        {RAIL.map((item, i) => {
          if (item.type === "photo") return <Photo key={item.src} item={item} index={i + 1} />;
          return <MapCard key="map" item={item} />;
        })}
        <span className="shrink-0 pr-2" aria-hidden="true" />
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-6 px-6 sm:px-10 lg:px-16">
        <div className="h-px flex-1 bg-white/10">
          <div
            className="h-px bg-white transition-[width] duration-150"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>

        <span className="hidden font-inter text-[10px] uppercase tracking-widest text-white/30 sm:block">
          Drag or swipe
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByPage(-1)}
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByPage(1)}
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
