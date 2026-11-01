"use client";
import type { Visual } from "@/content/site";
import ArtVisual from "./ArtVisual";

/**
 * Muestra la fotografía oficial si existe; si no, un visual provisional
 * con una etiqueta discreta para que nunca se confunda con material real.
 */
export default function Media({
  visual,
  seed = 1,
  className = "",
  showTag = true,
  priority = false,
}: {
  visual: Visual;
  seed?: number;
  className?: string;
  showTag?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {visual.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={visual.src}
          alt={visual.alt}
          className="h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <>
          <ArtVisual kind={visual.kind} seed={seed} />
          <span className="sr-only">{visual.alt} (visual provisional)</span>
          {showTag && (
            <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full border border-cream/15 bg-cacao/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-cream/55 backdrop-blur-sm">
              Visual provisional
            </span>
          )}
        </>
      )}
    </div>
  );
}
