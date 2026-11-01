"use client";
import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { origin } from "@/content/site";
import Media from "@/components/ui/Media";

/**
 * ESCENA 2 — El origen. Sección fija (sticky) donde los paisajes cambian
 * progresivamente con el scroll: revelado por máscara + zoom lento (Ken Burns).
 */
export default function Origin() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const n = origin.length;
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]");
      const imgs = gsap.utils.toArray<HTMLElement>("[data-slide-img]");
      slides.forEach((s, i) => i > 0 && gsap.set(s, { clipPath: "inset(100% 0 0 0)" }));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (st) => setActive(Math.min(n - 1, Math.floor(st.progress * n * 0.999))),
        },
      });
      imgs.forEach((img, i) => {
        tl.fromTo(img, { scale: 1.25, yPercent: 6 }, { scale: 1, yPercent: -4, duration: 1.4 }, i);
        if (i > 0) tl.to(slides[i], { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power2.inOut" }, i - 0.1);
      });
      tl.to("[data-origin-bar]", { scaleY: 1, duration: n }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="origen" ref={root} className="relative z-10 bg-cacao" style={{ height: `${origin.length * 100 + 50}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {origin.map((o, i) => (
          <div key={i} data-slide className="absolute inset-0" style={{ zIndex: i }}>
            <div data-slide-img className="absolute inset-0 will-change-transform">
              <Media visual={o.visual} seed={i + 3} showTag={false} priority={i === 0} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-cacao via-cacao/30 to-cacao/40" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 mx-auto flex max-w-[1600px] flex-col justify-end px-5 pb-[14vh] md:justify-center md:px-10 md:pb-0">
          <p className="mb-6 text-[10px] uppercase tracking-ultra text-gold md:text-[11px]">El origen del cacao venezolano</p>
          <div className="relative min-h-[16rem] md:min-h-[18rem]">
            {origin.map((o, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
                  i === active ? "translate-y-0 opacity-100 blur-0" : i < active ? "-translate-y-8 opacity-0 blur-sm" : "translate-y-8 opacity-0 blur-sm"
                }`}
                aria-hidden={i !== active}
              >
                <p className="mb-4 font-display text-lg italic text-gold-light">{o.eyebrow}</p>
                <h2 className="max-w-3xl font-display text-5xl font-light leading-[0.95] text-cream md:text-7xl lg:text-8xl">{o.title}</h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70 md:text-base">{o.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador vertical de capítulos */}
        <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 items-center gap-4 md:right-10">
          <div className="flex flex-col gap-5 text-right font-display text-sm">
            {origin.map((_, i) => (
              <span key={i} className={`transition-colors duration-700 ${i === active ? "text-gold" : "text-cream/30"}`}>
                0{i + 1}
              </span>
            ))}
          </div>
          <div className="relative h-40 w-px bg-cream/15">
            <div data-origin-bar className="absolute inset-0 origin-top scale-y-0 bg-gold" />
          </div>
        </div>
        <span className="absolute bottom-6 left-5 z-20 text-[9px] uppercase tracking-[0.25em] text-cream/40 md:left-10">
          Visuales provisionales · fotografía oficial pendiente
        </span>
      </div>
    </section>
  );
}
