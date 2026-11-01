"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { experience } from "@/lib/experience-state";
import { hero, brand } from "@/content/site";
import SplitReveal from "@/components/ui/SplitReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { useScrollTo } from "@/components/SmoothScroll";

/** ESCENA 1 — Hero cinematográfico. La mazorca 3D vive en el lienzo fijo. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Progreso de salida del hero → la mazorca se desvanece/reposiciona.
      gsap.to(experience, {
        heroOut: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      // Parallax de salida del contenido.
      gsap.to("[data-hero-content]", {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });
      gsap.set("[data-hero-fade]", { opacity: 0, y: 20 });
      const intro = () =>
        gsap.to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.7 });
      if ((window as unknown as { __kakawaReady?: boolean }).__kakawaReady) intro();
      else window.addEventListener("kakawa:ready", intro, { once: true });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={root} className="relative z-10 flex min-h-[100svh] items-end overflow-hidden pb-[12vh] md:items-center md:pb-0">
      {/* Halo cálido detrás del fruto */}
      <div aria-hidden className="pointer-events-none absolute right-[-10%] top-1/2 h-[90vmin] w-[90vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.16),transparent_62%)] max-md:right-1/2 max-md:translate-x-1/2" />

      <div data-hero-content className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <p data-hero-fade className="mb-6 flex items-center gap-4 text-[10px] uppercase tracking-ultra text-gold md:text-[11px]">
          <span className="h-px w-10 bg-gold/70" /> {hero.kicker}
        </p>

        <h1 className="sr-only">{brand.name} — {hero.title}</h1>
        <SplitReveal
          text={brand.name}
          by="char"
          onReady
          delay={0.15}
          className="font-display text-[19vw] font-light leading-[0.85] tracking-[0.08em] text-cream md:text-[11.5vw]"
        />
        <SplitReveal
          text={hero.title}
          onReady
          delay={0.55}
          className="mt-4 max-w-xl font-display text-3xl italic leading-tight text-gold-light md:mt-6 md:text-5xl"
        />
        <p data-hero-fade className="mt-6 max-w-md text-sm leading-relaxed text-cream/65 md:text-base">
          {hero.subtitle}
        </p>
        <div data-hero-fade className="mt-10">
          <MagneticButton onClick={() => scrollTo("#origen")}>{hero.cta}</MagneticButton>
        </div>
      </div>

      <button
        data-hero-fade
        onClick={() => scrollTo("#origen")}
        className="absolute bottom-8 right-6 flex flex-col items-center gap-3 text-[9px] uppercase tracking-ultra text-cream/50 md:right-10"
        aria-label="Desplazarse hacia abajo"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-cream/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-gold" />
        </span>
      </button>
    </section>
  );
}
