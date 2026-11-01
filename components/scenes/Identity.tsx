"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { brand, palette } from "@/content/site";
import Logo from "@/components/ui/Logo";
import SplitReveal from "@/components/ui/SplitReveal";

/**
 * ESCENA 5 — La identidad de KAKAWA.
 * Los textos de filosofía son una PROPUESTA editorial basada en el brief;
 * se deben sustituir por la filosofía oficial cuando esté disponible.
 */
const pillars = [
  { title: "Origen", text: "Todo comienza en la tierra venezolana." },
  { title: "Tradición", text: "El saber del cacao, transmitido con respeto." },
  { title: "Excelencia", text: "Cada detalle, tratado como una pieza única." },
];

export default function Identity() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-id-logo]", { scale: 0.75, opacity: 0, filter: "blur(12px)" }, {
        scale: 1, opacity: 1, filter: "blur(0px)", ease: "none",
        scrollTrigger: { trigger: "[data-id-logo]", start: "top 90%", end: "center 55%", scrub: 1 },
      });
      gsap.fromTo("[data-id-ring]", { rotate: -40 }, { rotate: 40, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from("[data-pillar]", { y: 60, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: "[data-pillars]", start: "top 80%" } });
      gsap.from("[data-swatch]", { scaleY: 0, transformOrigin: "bottom", stagger: 0.06, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: "[data-swatches]", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="kakawa" ref={root} className="relative z-10 overflow-hidden bg-cream py-28 text-cacao md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="text-center text-[10px] uppercase tracking-ultra text-earth md:text-[11px]">La identidad</p>

        <div className="relative mx-auto mt-14 flex aspect-square w-full max-w-[min(80vw,620px)] items-center justify-center">
          <svg data-id-ring viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <path id="ring-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
            </defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="#8a5a3b" strokeOpacity="0.25" strokeWidth="0.3" />
            <text fontSize="6.2" letterSpacing="4.2" fill="#8a5a3b" fillOpacity="0.7" style={{ textTransform: "uppercase" }}>
              <textPath href="#ring-path">Cacao venezolano · El origen de lo extraordinario · Cacao venezolano ·</textPath>
            </text>
          </svg>
          <div data-id-logo className="text-5xl text-cacao md:text-7xl">
            <Logo provisionalHint={!brand.logo} className="[&_span:last-child]:text-cacao/40" />
          </div>
        </div>

        <SplitReveal
          as="h2"
          text="Una marca que nace de la tierra y aspira al mundo."
          className="mx-auto mt-16 max-w-4xl text-center font-display text-4xl font-light leading-[1.05] md:mt-24 md:text-6xl"
        />

        <div data-pillars className="mx-auto mt-20 grid max-w-5xl gap-px overflow-hidden rounded-sm bg-cacao/10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title} data-pillar className="group bg-cream p-8 transition-colors duration-700 hover:bg-cacao md:p-10" data-cursor="">
              <span className="font-display text-sm text-earth transition-colors duration-700 group-hover:text-gold">0{i + 1}</span>
              <h3 className="mt-6 font-display text-3xl transition-colors duration-700 group-hover:text-cream md:text-4xl">{p.title}</h3>
              <p className="mt-3 text-sm text-cacao/60 transition-colors duration-700 group-hover:text-cream/60">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-cacao/40">Propuesta editorial · sustituir por la filosofía oficial de la marca</p>

        <div className="mx-auto mt-24 max-w-5xl">
          <p className="mb-6 text-[10px] uppercase tracking-ultra text-earth">Paleta de la experiencia</p>
          <div data-swatches className="grid grid-cols-4 gap-2 md:grid-cols-7">
            {palette.map((c) => (
              <div key={c.hex} data-swatch className="group">
                <div className="h-24 rounded-sm ring-1 ring-cacao/10 transition-transform duration-700 ease-out group-hover:-translate-y-2 md:h-36" style={{ background: c.hex }} />
                <p className="mt-3 text-[11px] font-medium">{c.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-cacao/50">{c.hex}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-cacao/40">Paleta de diseño web · se ajustará a los colores oficiales de KAKAWA</p>
        </div>
      </div>
    </section>
  );
}
