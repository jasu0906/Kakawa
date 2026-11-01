"use client";
import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { experience } from "@/lib/experience-state";
import { podChapters } from "@/content/site";

/**
 * ESCENA 3 — La mazorca en 3D. La sección es transparente y está fijada
 * mientras el scroll controla la apertura del fruto en el lienzo WebGL.
 */
export default function PodScene() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);

  useIsoLayoutEffect(() => {
    const n = podChapters.length;
    const ctx = gsap.context(() => {
      gsap.fromTo(experience, { podEnter: 0 }, { podEnter: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true } });
      gsap.fromTo(experience, { podExit: 0 }, { podExit: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "bottom bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(
        experience,
        { pod: 0 },
        {
          pod: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (st) => setChapter(Math.min(n - 1, Math.floor(st.progress * n * 0.999))),
          },
        },
      );
      // Tipografía gigante de fondo con parallax horizontal.
      gsap.fromTo("[data-pod-bg]", { xPercent: 10 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo("[data-pod-ring]", { strokeDashoffset: 302 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="mazorca" ref={root} className="relative z-10 h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-5 py-24 md:px-10 md:py-28">
        <div aria-hidden data-pod-bg className="text-outline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[34vw] font-light leading-none text-transparent opacity-[0.07] md:text-[24vw]">
          La mazorca · La mazorca
        </div>

        <div className="relative mx-auto flex w-full max-w-[1600px] items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-gold md:text-[11px]">Una experiencia 3D</p>
            <h2 className="mt-3 font-display text-4xl font-light text-cream md:text-6xl">La mazorca</h2>
          </div>
          <div className="relative h-16 w-16 md:h-20 md:w-20" aria-hidden>
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="48" stroke="rgba(243,234,217,0.12)" strokeWidth="1" fill="none" />
              <circle data-pod-ring cx="50" cy="50" r="48" stroke="#c9a96e" strokeWidth="1.2" fill="none" strokeDasharray="302" strokeDashoffset="302" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-lg text-gold">{podChapters[chapter].label}</span>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-[1600px] items-end gap-6 md:grid-cols-[1fr_auto]">
          <div className="relative h-36 md:h-44">
            {podChapters.map((c, i) => (
              <div
                key={c.title}
                aria-hidden={i !== chapter}
                className={`absolute bottom-0 left-0 max-w-md transition-all duration-1000 ease-out ${i === chapter ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                <h3 className="font-display text-4xl italic text-gold-light md:text-6xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70 md:text-base">{c.text}</p>
              </div>
            ))}
          </div>
          <ol className="hidden gap-8 md:flex">
            {podChapters.map((c, i) => (
              <li key={c.title} className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] transition-colors duration-700 ${i <= chapter ? "text-cream" : "text-cream/30"}`}>
                <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-700 ${i <= chapter ? "bg-gold" : "bg-cream/20"}`} />
                {c.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
