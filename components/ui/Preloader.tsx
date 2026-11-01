"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { experience } from "@/lib/experience-state";
import { brand } from "@/content/site";

/** Telón de entrada: contador + wordmark; al terminar dispara "kakawa:ready". */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("is-loading");
    const finish = () => {
      experience.ready = true;
      (window as unknown as { __kakawaReady?: boolean }).__kakawaReady = true;
      document.documentElement.classList.remove("is-loading");
      window.dispatchEvent(new Event("kakawa:ready"));
    };

    if (reduce) {
      finish();
      setDone(true);
      return;
    }

    const counter = { v: 0 };
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
    const tl = gsap.timeline({ paused: true });
    tl.to(counter, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to("[data-pl-letter]", { yPercent: 0, opacity: 1, stagger: 0.06, duration: 1, ease: "expo.out" }, 0.2)
      .to("[data-pl-line]", { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.1)
      .to("[data-pl-letter]", { yPercent: -110, opacity: 0, stagger: 0.03, duration: 0.7, ease: "expo.in" }, "+=0.15")
      .add(finish, "-=0.2")
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut" }, "-=0.35")
      .add(() => setDone(true));

    fonts.then(() => tl.play());
    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-cacao-900"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-live="polite"
      aria-label="Cargando experiencia"
    >
      <div className="flex overflow-hidden font-display text-5xl tracking-[0.3em] text-cream md:text-7xl">
        {brand.name.split("").map((c, i) => (
          <span key={i} data-pl-letter className="inline-block translate-y-[110%] opacity-0">
            {c}
          </span>
        ))}
      </div>
      <div data-pl-line className="mt-8 h-px w-48 origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <span ref={count} className="absolute bottom-8 right-8 font-display text-sm tracking-[0.3em] text-gold/80">
        000
      </span>
      <span className="absolute bottom-8 left-8 text-[10px] uppercase tracking-ultra text-cream/40">Cacao venezolano</span>
    </div>
  );
}
