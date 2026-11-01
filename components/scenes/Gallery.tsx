"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { gallery } from "@/content/site";
import Media from "@/components/ui/Media";
import { useLenis } from "@/components/SmoothScroll";

function Tile({ item, index, onOpen }: { item: (typeof gallery)[number]; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: px * 8, rotateX: -py * 8, duration: 0.6, ease: "power3.out" });
    gsap.to(ref.current.querySelector("[data-tile-img]"), { x: -px * 18, y: -py * 18, scale: 1.08, duration: 0.8, ease: "power3.out" });
  };
  const leave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 1, ease: "expo.out" });
    gsap.to(ref.current.querySelector("[data-tile-img]"), { x: 0, y: 0, scale: 1, duration: 1, ease: "expo.out" });
  };
  const span = item.span === "tall" ? "row-span-2" : item.span === "wide" ? "md:col-span-2" : "";
  return (
    <button
      ref={ref}
      data-tile
      onClick={onOpen}
      onPointerMove={move}
      onPointerLeave={leave}
      data-cursor="Ver"
      className={`group relative overflow-hidden rounded-sm bg-cacao-700 text-left [transform-style:preserve-3d] ${span}`}
      aria-label={`Ampliar: ${item.caption}`}
    >
      <div data-tile-img className="absolute inset-[-4%] will-change-transform">
        <Media visual={item} seed={index + 21} showTag={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-cacao/80 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 md:p-5">
        <span className="font-display text-xl text-cream md:text-2xl">{item.caption}</span>
        <span className="translate-y-2 text-[10px] uppercase tracking-[0.25em] text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          0{index + 1}
        </span>
      </div>
    </button>
  );
}

/** ESCENA 6 — Galería inmersiva con inclinación 3D al cursor y visor a pantalla completa. */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((t, i) => {
        gsap.fromTo(t, { clipPath: "inset(100% 0 0 0)", y: 80 }, {
          clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.4, ease: "expo.out", delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: t, start: "top 92%" },
        });
      });
      gsap.fromTo("[data-gal-title]", { xPercent: 0 }, { xPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + gallery.length) % gallery.length)), []);

  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis, step]);

  return (
    <section id="galeria" ref={root} className="relative z-10 overflow-hidden bg-cacao py-28 md:py-40">
      <div data-gal-title aria-hidden className="pointer-events-none whitespace-nowrap font-display text-[22vw] font-light leading-none text-cream/[0.04] md:text-[16vw]">
        Galería · Texturas · Origen
      </div>
      <div className="mx-auto -mt-[8vw] max-w-[1600px] px-5 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-gold md:text-[11px]">Galería visual</p>
            <h2 className="mt-4 font-display text-5xl font-light text-cream md:text-7xl">El universo del cacao</h2>
          </div>
          <p className="max-w-xs text-sm text-cream/50">Visuales provisionales. Se sustituirán por la fotografía oficial de KAKAWA.</p>
        </div>
        <div className="grid auto-rows-[38vw] grid-cols-2 gap-3 [perspective:1200px] md:auto-rows-[22vw] md:grid-cols-4 md:gap-4">
          {gallery.map((g, i) => (
            <Tile key={i} item={g} index={i} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-cacao-900/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            role="dialog"
            aria-modal="true"
            aria-label={gallery[open].caption}
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={open}
              className="relative h-[72svh] w-[min(90vw,calc(72svh*0.8))] overflow-hidden rounded-sm"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Media visual={gallery[open]} seed={open + 21} />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-6 text-cream" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => step(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold" aria-label="Anterior">←</button>
              <span className="min-w-[8rem] text-center font-display text-lg">{gallery[open].caption} <span className="text-gold">· 0{open + 1}</span></span>
              <button onClick={() => step(1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold" aria-label="Siguiente">→</button>
            </div>
            <button onClick={() => setOpen(null)} className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold md:right-10 md:top-8" aria-label="Cerrar">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
