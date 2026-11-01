"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";

/**
 * Animación tipográfica: divide el texto en palabras/caracteres y los
 * revela desde una máscara cuando entran en pantalla (o al evento ready).
 */
export default function SplitReveal({
  text,
  as = "div",
  className = "",
  by = "word",
  delay = 0,
  stagger,
  start = "top 85%",
  onReady = false,
  scrub = false,
}: {
  text: string;
  as?: "div" | "h1" | "h2" | "h3" | "p";
  className?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  start?: string;
  /** Si es true espera al fin del preloader en lugar de al scroll. */
  onReady?: boolean;
  scrub?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parts = el.querySelectorAll<HTMLElement>("[data-part]");
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.set(parts, { yPercent: 115, rotate: by === "char" ? 6 : 3, opacity: 0 });
      const anim = {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: by === "char" ? 1.1 : 1.3,
        ease: "expo.out",
        stagger: stagger ?? (by === "char" ? 0.035 : 0.07),
        delay,
      };
      if (onReady) {
        const play = () => gsap.to(parts, anim);
        if ((window as unknown as { __kakawaReady?: boolean }).__kakawaReady) play();
        else window.addEventListener("kakawa:ready", play, { once: true });
      } else if (scrub) {
        gsap.to(parts, { ...anim, ease: "none", scrollTrigger: { trigger: el, start, end: "bottom 45%", scrub: 1 } });
      } else {
        gsap.to(parts, { ...anim, scrollTrigger: { trigger: el, start, once: true } });
      }
    }, el);
    return () => ctx.revert();
  }, [by, delay, stagger, start, onReady, scrub]);

  const Tag = as as "div";
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden whitespace-nowrap pb-[0.08em] align-bottom" aria-hidden>
          {by === "char" ? (
            w.split("").map((c, ci) => (
              <span key={ci} data-part className="inline-block will-change-transform">
                {c}
              </span>
            ))
          ) : (
            <span data-part className="inline-block will-change-transform">
              {w}
            </span>
          )}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
