"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { process } from "@/content/site";
import Media from "@/components/ui/Media";

/**
 * ESCENA 4 — Del cacao al chocolate. En desktop: recorrido horizontal fijado
 * con un hilo dorado que conecta cada etapa. En móvil: relato vertical.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo("[data-thread]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 1 } });
      // Cada imagen hace parallax interno mientras cruza la pantalla.
      gsap.utils.toArray<HTMLElement>("[data-step-img]").forEach((img) => {
        gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-step-text]").forEach((t) => {
        gsap.from(t.children, { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: t, containerAnimation: tween, start: "left 80%" } });
      });
    });
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((s) => {
        gsap.from(s, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 85%" } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="proceso" ref={root} className="relative z-10 overflow-hidden bg-cacao-800 md:h-[100svh]">
      <div ref={track} className="flex h-full flex-col gap-16 px-5 py-24 md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:py-0">
        {/* Intro */}
        <div className="flex shrink-0 flex-col justify-center md:h-full md:w-[48vw] md:pl-10 md:pr-16 lg:w-[40vw]">
          <p className="text-[10px] uppercase tracking-ultra text-gold md:text-[11px]">Del cacao al chocolate</p>
          <h2 className="mt-5 font-display text-5xl font-light leading-[0.95] text-cream md:text-7xl">
            Un viaje de <em className="text-gold-light">ocho</em> transformaciones
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/60">Desliza para recorrer el camino del fruto: de la tierra a la experiencia final.</p>
        </div>

        {process.map((s, i) => (
          <article key={s.title} data-step className="relative flex shrink-0 flex-col gap-6 md:h-full md:w-[62vw] md:flex-row md:items-center md:gap-10 md:pr-16 lg:w-[52vw]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm md:aspect-auto md:h-[64vh] md:w-[56%]">
              <div data-step-img className="absolute inset-[-8%] will-change-transform">
                <Media visual={s.visual} seed={i + 11} showTag={false} />
              </div>
              <span className="absolute bottom-3 left-3 rounded-full border border-cream/15 bg-cacao/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-cream/55 backdrop-blur-sm">
                Visual provisional
              </span>
            </div>
            <div data-step-text className="md:w-[40%]">
              <span className="block font-display text-7xl font-light text-gold/30 md:text-9xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="-mt-4 font-display text-4xl text-cream md:-mt-8 md:text-5xl">{s.title}</h3>
              <span className="my-5 block h-px w-12 bg-gold/60" />
              <p className="max-w-xs text-sm leading-relaxed text-cream/65">{s.text}</p>
            </div>
          </article>
        ))}
        <div className="hidden shrink-0 md:block md:w-[10vw]" />
      </div>
      {/* Hilo dorado que conecta las etapas */}
      <div className="absolute bottom-10 left-10 right-10 hidden h-px bg-cream/10 md:block">
        <div data-thread className="h-full origin-left bg-gradient-to-r from-gold/20 via-gold to-gold-light" />
      </div>
    </section>
  );
}
