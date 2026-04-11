import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const TOTAL_FRAMES = 128;

type Hotspot = {
  id: string;
  label: string;
  title: string;
  detail: string;
  x: number;
  y: number;
};

const hotspots: Hotspot[] = [
  {
    id: "sofa",
    label: "Sofa",
    title: "Textured Linen Sofa",
    detail: "Breathable linen blend with high-density cushions and low-profile Scandinavian geometry.",
    x: 32,
    y: 67,
  },
  {
    id: "table",
    label: "Coffee Table",
    title: "CNC Craft Coffee Table",
    detail: "Precision-cut oak veneer top with matte sealing and hand-finished chamfered edges.",
    x: 49,
    y: 72,
  },
  {
    id: "tv",
    label: "TV Unit",
    title: "Integrated Media Console",
    detail: "Hidden cable channels, push-latch storage, and layered shelving for calm visual rhythm.",
    x: 72,
    y: 58,
  },
];

const getFrameUrl = (index: number) => {
  const padded = index.toString().padStart(3, "0");
  const delay = index % 4 === 1 ? "0.07" : "0.06";
  return `/frames/frame_${padded}_delay-${delay}s.jpg`;
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) => {
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const offsetX = (canvasWidth - drawWidth) / 2;
  const offsetY = (canvasHeight - drawHeight) / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
};

const DayNightStudioSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const smoothProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastUiFrameRef = useRef(0);

  const [frameLoadCount, setFrameLoadCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string>("sofa");

  const frameUrls = useMemo(
    () => Array.from({ length: TOTAL_FRAMES }, (_, idx) => getFrameUrl(idx)),
    [],
  );

  const drawFrameFromProgress = (value: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(value * (TOTAL_FRAMES - 1))),
    );
    const frame = framesRef.current[frameIndex];
    if (!frame || !frame.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawImageCover(ctx, canvas, frame);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, Math.floor(bounds.width * dpr));
      const nextHeight = Math.max(1, Math.floor(bounds.height * dpr));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      drawFrameFromProgress(smoothProgressRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFrame = (index: number) => {
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrls[index];
      image.onload = () => {
        if (cancelled) return;
        framesRef.current[index] = image;
        setFrameLoadCount((count) => count + 1);

        if (index === 0 || Math.abs(index - Math.round(smoothProgressRef.current * (TOTAL_FRAMES - 1))) <= 1) {
          drawFrameFromProgress(smoothProgressRef.current);
        }
      };
    };

    // Load first frame immediately so there is no blank state.
    loadFrame(0);

    // Progressive loading in small batches to avoid main-thread spikes.
    let index = 1;
    const batchSize = 8;

    const loadBatch = () => {
      if (cancelled) return;
      for (let i = 0; i < batchSize && index < TOTAL_FRAMES; i += 1) {
        loadFrame(index);
        index += 1;
      }

      if (index < TOTAL_FRAMES) {
        window.setTimeout(loadBatch, 45);
      }
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [frameUrls]);

  useEffect(() => {
    const updateTarget = () => {
      const wrapper = sectionRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const totalScrollable = Math.max(1, wrapper.offsetHeight - window.innerHeight);
      const traveled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      targetProgressRef.current = traveled / totalScrollable;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(function tick() {
          const current = smoothProgressRef.current;
          const target = targetProgressRef.current;
          const next = current + (target - current) * 0.14;
          const now = performance.now();

          smoothProgressRef.current = Math.abs(target - next) < 0.001 ? target : next;
          drawFrameFromProgress(smoothProgressRef.current);

          if (now - lastUiFrameRef.current > 45 || Math.abs(target - smoothProgressRef.current) < 0.01) {
            setProgress(smoothProgressRef.current);
            lastUiFrameRef.current = now;
          }

          if (Math.abs(target - smoothProgressRef.current) > 0.001) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            rafRef.current = null;
          }
        });
      }
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const activeCard = hotspots.find((spot) => spot.id === activeHotspot) ?? hotspots[0];
  const moodOpacity = Math.min(0.8, progress * 0.95);
  const dayTint = Math.max(0.08, 0.22 - progress * 0.2);

  return (
    <section
      aria-label="Living room day to night transformation"
      className="relative overflow-hidden py-24 md:py-28"
      style={{
        background: `linear-gradient(180deg, rgba(245,241,237,1) 0%, rgba(237,231,227,1) ${40 - progress * 8}%, rgba(45,31,26,${progress * 0.5}) 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.45) 0%, transparent 38%), radial-gradient(circle at 85% 30%, rgba(202,149,108,0.22) 0%, transparent 44%)",
      }} />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-primary/80">Light Narrative</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            Scroll Through A Living Room That Shifts From Daylight To Warm Night
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
            The composition stays still while atmosphere evolves. Follow the light transition to feel how texture,
            depth, and emotion transform the same interior canvas.
          </p>
        </motion.div>
      </div>

      <div ref={sectionRef} className="relative mt-14 h-[260vh]">
        <div className="sticky top-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-[#f7f2ec]/75 shadow-[0_30px_80px_rgba(48,32,25,0.18)] backdrop-blur-sm">
              <div className="relative aspect-[16/9]">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  aria-label="Day to night interior canvas animation"
                />

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,245,232,${dayTint}) 0%, rgba(255,207,154,${dayTint * 0.65}) 32%, rgba(32,18,12,${moodOpacity}) 100%)`,
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    boxShadow: `inset 0 0 180px rgba(0,0,0,${progress * 0.42})`,
                  }}
                />

                <div className="pointer-events-none absolute left-6 top-6 rounded-full bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-foreground/70 backdrop-blur-sm">
                  Day / Night Progress {(progress * 100).toFixed(0)}%
                </div>
                <div className="pointer-events-none absolute bottom-6 left-6 rounded-xl bg-black/25 px-4 py-2 text-xs tracking-wide text-white/90 backdrop-blur-sm">
                  Frames Loaded: {frameLoadCount}/{TOTAL_FRAMES}
                </div>

                {hotspots.map((spot, index) => {
                  const isActive = activeHotspot === spot.id;
                  return (
                    <motion.button
                      key={spot.id}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: progress > 0.2 ? 1 : 0,
                        scale: progress > 0.2 ? 1 : 0.72,
                      }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onFocus={() => setActiveHotspot(spot.id)}
                      onClick={() => setActiveHotspot(spot.id)}
                      aria-label={`Hotspot ${spot.label}`}
                    >
                      <span
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full border text-[11px] font-medium tracking-wide transition-all duration-300 ${
                          isActive
                            ? "border-white/90 bg-white text-[#3d2922] shadow-[0_0_0_8px_rgba(255,255,255,0.22)]"
                            : "border-white/60 bg-white/18 text-white backdrop-blur-sm hover:bg-white/30"
                        }`}
                      >
                        {spot.label}
                      </span>
                    </motion.button>
                  );
                })}

                <motion.div
                  key={activeCard.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: progress > 0.2 ? 1 : 0, y: progress > 0.2 ? 0 : 12 }}
                  transition={{ duration: 0.35 }}
                  className="absolute bottom-5 right-5 z-20 w-[min(360px,calc(100%-2.5rem))] rounded-2xl border border-white/45 bg-white/84 p-4 shadow-xl backdrop-blur-md"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-primary/80">Interactive Detail</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{activeCard.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{activeCard.detail}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-6xl space-y-7 px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid gap-5 md:grid-cols-3"
        >
          <article className="rounded-3xl border border-[#d3c2b6] bg-[#f9f4ef] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/70">Furniture Highlight</p>
            <h3 className="mt-3 text-2xl">Grounded Lounge Geometry</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Low silhouettes and generous seating depth maintain visual calm while supporting daily flexibility.
            </p>
          </article>

          <article className="rounded-3xl border border-[#d3c2b6] bg-[#f5eee8] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/70">Material Language</p>
            <h3 className="mt-3 text-2xl">Oak, Linen, Matte Metal</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Light wood grain and tactile fabrics hold softness under daylight, then absorb warm ambient light at night.
            </p>
          </article>

          <article className="rounded-3xl border border-[#d3c2b6] bg-[#efe6de] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/70">Design Philosophy</p>
            <h3 className="mt-3 text-2xl">Emotion Through Light</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Instead of changing objects, we tune illumination and contrast so the same room tells two stories.
            </p>
          </article>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 rounded-[2rem] border border-[#d1b8a8] bg-[#2a1d17] p-7 text-[#f8efe7] md:grid-cols-2 md:p-9"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#e6c8ac]">Transformation Story</p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight">Before / After, Same Room. Different Atmosphere.</h3>
          </div>
          <p className="text-sm leading-relaxed text-[#f4e5d8]/85 md:text-base">
            Morning mode maximizes clarity for work and family movement. Night mode lowers contrast, boosts warm
            pockets of light, and deepens shadow layering for a cinematic lounge feel without visual clutter.
          </p>
        </motion.article>
      </div>
    </section>
  );
};

export default DayNightStudioSection;
