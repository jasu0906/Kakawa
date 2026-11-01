"use client";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/** Botón con atracción magnética al cursor y relleno animado. */
export default function MagneticButton({
  children,
  onClick,
  href,
  variant = "outline",
  cursor = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "outline" | "solid";
  cursor?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.4, duration: 0.6, ease: "power3.out" });
    gsap.to(inner.current, { x: x * 0.12, y: y * 0.15, duration: 0.6, ease: "power3.out" });
  };
  const leave = () => {
    gsap.to([ref.current, inner.current], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };

  const cls = `group relative inline-flex items-center gap-4 overflow-hidden rounded-full px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-500 ${
    variant === "solid" ? "bg-gold text-cacao" : "border border-gold/50 text-cream hover:text-cacao"
  }`;
  const content = (
    <>
      <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-700 ease-out group-hover:translate-y-0" />
      <span ref={inner} className="relative z-10 flex items-center gap-4">
        {children}
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
          <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} target="_blank" rel="noopener noreferrer" className={cls} onPointerMove={move} onPointerLeave={leave} data-cursor={cursor}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} type="button" onClick={onClick} className={cls} onPointerMove={move} onPointerLeave={leave} data-cursor={cursor}>
      {content}
    </button>
  );
}
