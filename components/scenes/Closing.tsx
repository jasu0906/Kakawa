"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { experience } from "@/lib/experience-state";
import { brand, closing } from "@/content/site";
import SplitReveal from "@/components/ui/SplitReveal";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { useScrollTo } from "@/components/SmoothScroll";

/** ESCENA 8 — Cierre cinematográfico: la mazorca regresa y la marca firma la experiencia. */
export default function Closing() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const hasContact = brand.socials.length > 0 || brand.email || brand.phone;

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(experience, { closeEnter: 0 }, { closeEnter: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 10%", scrub: true } });
      gsap.from("[data-close-fade]", { opacity: 0, y: 30, stagger: 0.12, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "[data-close-sign]", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contacto" ref={root} className="relative z-10 flex min-h-[140svh] flex-col justify-between overflow-hidden pt-[30svh]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cacao-800 to-transparent" />
      <div className="relative mx-auto w-full max-w-[1600px] px-5 text-center md:px-10">
        <SplitReveal
          as="h2"
          text={closing.title}
          scrub
          start="top 90%"
          className="mx-auto max-w-5xl font-display text-[11vw] font-light uppercase leading-[0.95] text-cream md:text-[6.5vw]"
        />
        <div data-close-sign className="mt-[26svh] md:mt-[34svh]">
          <p data-close-fade className="font-display text-2xl italic text-gold-light md:text-3xl">{closing.signature}</p>
          <div data-close-fade className="mt-10 flex justify-center">
            <MagneticButton onClick={() => scrollTo(0)} cursor="Inicio">Volver al origen</MagneticButton>
          </div>
        </div>
      </div>

      <footer className="relative mt-24 border-t border-cream/10 bg-cacao-900/70 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-12 md:grid-cols-3 md:items-center md:px-10">
          <div className="text-2xl text-cream">
            <Logo />
          </div>
          <div className="text-center">
            {hasContact ? (
              <ul className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-[0.25em] text-cream/70">
                {brand.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-gold">{s.label}</a>
                  </li>
                ))}
                {brand.email && (
                  <li><a href={`mailto:${brand.email}`} className="link-underline hover:text-gold">{brand.email}</a></li>
                )}
                {brand.phone && (
                  <li><a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="link-underline hover:text-gold">{brand.phone}</a></li>
                )}
              </ul>
            ) : (
              <p className="text-[10px] uppercase tracking-[0.25em] text-cream/35">Redes y contacto oficiales · próximamente</p>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/35 md:text-right">
            © {new Date().getFullYear()} {brand.name} · Cacao venezolano
          </p>
        </div>
      </footer>
    </section>
  );
}
