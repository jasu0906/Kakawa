import { brand } from "@/content/site";

/**
 * Logotipo. Mientras no se suba el archivo oficial (brand.logo), se usa un
 * wordmark tipográfico NEUTRO marcado como provisional — no es una
 * propuesta de identidad alternativa.
 */
export default function Logo({ className = "", provisionalHint = false }: { className?: string; provisionalHint?: boolean }) {
  if (brand.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={brand.logo} alt={brand.name} className={`h-full w-auto ${className}`} />;
  }
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} aria-label={brand.name}>
      <span className="font-display tracking-[0.32em] [padding-left:0.32em]">{brand.name}</span>
      {provisionalHint && (
        <span className="mt-3 text-[9px] font-sans uppercase tracking-[0.3em] text-cream/40">Wordmark provisional · logotipo oficial pendiente</span>
      )}
    </span>
  );
}
