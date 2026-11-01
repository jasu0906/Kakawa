"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { products, type Product } from "@/content/site";

/** Tarjeta con profundidad: capas que se desplazan a distinta velocidad según el cursor. */
function Showcase({ product, index }: { product: Product | null; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: px * 10, rotateX: -py * 10, duration: 0.7, ease: "power3.out" });
    gsap.to(ref.current.querySelectorAll("[data-depth]"), {
      x: (_, el: HTMLElement) => px * Number(el.dataset.depth),
      y: (_, el: HTMLElement) => py * Number(el.dataset.depth),
      duration: 0.8,
      ease: "power3.out",
    });
  };
  const leave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 1.2, ease: "expo.out" });
    gsap.to(ref.current.querySelectorAll("[data-depth]"), { x: 0, y: 0, duration: 1.2, ease: "expo.out" });
  };

  return (
    <div data-product className="[perspective:1400px]">
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-gradient-to-b from-cacao-600 to-cacao-900 ring-1 ring-gold/10 [transform-style:preserve-3d]"
        data-cursor={product ? "Explorar" : ""}
      >
        <div data-depth="20" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,169,110,0.25),transparent_60%)]" />
        {/* Pedestal */}
        <div data-depth="10" className="absolute bottom-[14%] left-1/2 h-[10%] w-[58%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-chocolate to-cacao-900 shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
        {product ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img data-depth="40" src={product.image} alt={product.name} className="absolute inset-x-[12%] bottom-[18%] top-[10%] h-auto w-[76%] object-contain drop-shadow-2xl transition-transform duration-1000 ease-out group-hover:scale-105" />
        ) : (
          <div data-depth="40" className="absolute inset-x-[22%] bottom-[20%] top-[16%] flex items-center justify-center rounded-sm border border-dashed border-gold/30 bg-cacao/30">
            <span className="px-4 text-center font-display text-lg italic text-gold/60">Pieza {String(index + 1).padStart(2, "0")}</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent" />
      </div>
      <div className="mt-6">
        {product ? (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-3xl text-cream">{product.name}</h3>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{product.presentation}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-cream/60">{product.description}</p>
          </>
        ) : (
          <>
            <h3 className="font-display text-2xl text-cream/70">Producto oficial por incorporar</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/35">Nombre · descripción · presentación</p>
          </>
        )}
      </div>
    </div>
  );
}

/** ESCENA 7 — Productos presentados como piezas de lujo (sólo productos reales de KAKAWA). */
export default function Products() {
  const root = useRef<HTMLElement>(null);
  const items: (Product | null)[] = products.length ? products : [null, null, null];

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-product]", { y: 100, opacity: 0, stagger: 0.15, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "[data-products]", start: "top 80%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="productos" ref={root} className="relative z-10 bg-cacao-800 py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-gold md:text-[11px]">La colección</p>
            <h2 className="mt-4 font-display text-5xl font-light leading-[0.95] text-cream md:text-7xl">
              Piezas que cuentan <em className="text-gold-light">su origen</em>
            </h2>
          </div>
          {!products.length && (
            <p className="max-w-sm text-sm text-cream/50 md:justify-self-end">
              Esta vitrina mostrará exclusivamente los productos reales de KAKAWA en cuanto se incorporen sus fotografías y descripciones oficiales.
            </p>
          )}
        </div>
        <div data-products className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((p, i) => (
            <Showcase key={p?.name ?? i} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
