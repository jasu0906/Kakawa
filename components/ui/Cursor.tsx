"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cursor personalizado (sólo dispositivos con puntero fino).
 * Elementos con [data-cursor="texto"] amplían el anillo y muestran una etiqueta.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    const xTag = gsap.quickTo(tag.current, "x", { duration: 0.55, ease: "power3" });
    const yTag = gsap.quickTo(tag.current, "y", { duration: 0.55, ease: "power3" });

    gsap.set([dot.current, ring.current], { opacity: 0 });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.4 });
      }
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY); xTag(e.clientX); yTag(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const text = t?.dataset.cursor ?? "";
      setLabel(text);
      gsap.to(ring.current, { scale: t ? (text ? 2.6 : 1.7) : 1, duration: 0.5, ease: "expo.out" });
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.3 });
      gsap.to(tag.current, { opacity: text ? 1 : 0, duration: 0.3 });
    };
    const leave = () => gsap.to([dot.current, ring.current, tag.current], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className={enabled ? "" : "hidden"}>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-gold-light mix-blend-difference" />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 h-10 w-10 rounded-full border border-gold/60 bg-cacao/10 backdrop-blur-[1px]"
      />
      <div ref={tag} className="pointer-events-none fixed left-0 top-0 z-[101] opacity-0">
        <span className="block -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold-light">{label}</span>
      </div>
    </div>
  );
}
