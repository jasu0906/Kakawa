"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { experience } from "@/lib/experience-state";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Desplaza a un ancla con Lenis (o de forma nativa si está desactivado). */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string | number, offset = 0) => {
    if (lenis) lenis.scrollTo(target as string, { offset, duration: 1.8 });
    else if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const raf = useRef<(t: number) => void>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cursor normalizado para la escena 3D y parallax.
    const onMove = (e: PointerEvent) => {
      experience.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      experience.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    if (reduce) {
      return () => window.removeEventListener("pointermove", onMove);
    }

    const instance = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 });
    instance.on("scroll", ScrollTrigger.update);
    raf.current = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf.current);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) gsap.ticker.remove(raf.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
