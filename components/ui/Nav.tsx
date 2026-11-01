"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollTo, useLenis } from "@/components/SmoothScroll";
import Logo from "./Logo";

const LINKS = [
  { id: "#origen", label: "Origen" },
  { id: "#mazorca", label: "La mazorca" },
  { id: "#proceso", label: "Proceso" },
  { id: "#kakawa", label: "Kakawa" },
  { id: "#galeria", label: "Galería" },
  { id: "#productos", label: "Productos" },
];

export default function Nav() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const menu = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);

  // Ocultar al bajar, mostrar al subir + barra de progreso.
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const play = () => gsap.fromTo(bar.current, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, ease: "expo.out", delay: 0.6 });
    if ((window as unknown as { __kakawaReady?: boolean }).__kakawaReady) play();
    else window.addEventListener("kakawa:ready", play, { once: true });
  }, []);

  // Menú a pantalla completa (móvil y desktop).
  useEffect(() => {
    if (!menu.current) return;
    if (open) {
      lenis?.stop();
      gsap.set(menu.current, { display: "flex" });
      gsap.fromTo(menu.current, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 1.1, ease: "expo.inOut" });
      gsap.fromTo(menu.current.querySelectorAll("[data-mi]"), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 1, ease: "expo.out", delay: 0.35 });
    } else {
      lenis?.start();
      gsap.to(menu.current, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => {
          if (menu.current) gsap.set(menu.current, { display: "none" });
        },
      });
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // Espera a que se libere el scroll antes de desplazar.
    setTimeout(() => scrollTo(id), open ? 450 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 opacity-0 mix-blend-difference transition-transform duration-700 ease-out ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <button onClick={() => go("#inicio")} className="text-lg text-cream md:text-xl" aria-label="Ir al inicio" data-cursor="Inicio">
            <Logo />
          </button>
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="link-underline text-[11px] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-cream">
                {l.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setOpen((o) => !o)}
            className="group relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 backdrop-blur-sm transition-colors hover:border-gold lg:hidden"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <span className={`absolute h-px w-4 bg-cream transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span className={`absolute h-px w-4 bg-cream transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0" style={{ width: `${progress * 100}%` }} />
      </header>

      <div id="menu" ref={menu} className="fixed inset-0 z-[55] hidden flex-col justify-between bg-cacao-800 px-6 pb-10 pt-28" role="dialog" aria-modal="true" aria-label="Menú">
        <ul className="space-y-2">
          {LINKS.map((l, i) => (
            <li key={l.id} className="overflow-hidden">
              <button data-mi onClick={() => go(l.id)} className="flex items-baseline gap-4 font-display text-5xl text-cream sm:text-6xl">
                <span className="font-sans text-xs text-gold">0{i + 1}</span>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-[10px] uppercase tracking-ultra text-cream/40">Cacao venezolano</p>
      </div>
    </>
  );
}
