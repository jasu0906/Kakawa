"use client";
import { useId } from "react";
import type { VisualKind } from "@/content/site";

/**
 * Ilustraciones generativas en SVG que actúan como VISUALES PROVISIONALES
 * mientras llega el material fotográfico oficial. Están pensadas para
 * mantener la dirección de arte (luz cálida, fondos profundos, dorado
 * champagne) sin hacerse pasar por fotografías reales.
 */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function ridgePath(r: () => number, baseY: number, amp: number, w = 800, h = 1000, steps = 14) {
  let d = `M0 ${h} L0 ${baseY}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = baseY - Math.sin(i * 0.9 + r() * 2) * amp * 0.6 - r() * amp;
    const cx = x - w / steps / 2;
    d += ` Q${cx.toFixed(1)} ${(y - amp * 0.3 * r()).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + ` L${w} ${h} Z`;
}

function Pod({ x, y, s, rot, id, light = "#e9b25a" }: { x: number; y: number; s: number; rot: number; id: string; light?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="60" ry="130" fill={`url(#${id}-pod)`} />
      {[-42, -24, -8, 8, 24, 42].map((o, i) => (
        <path key={i} d={`M${o * 0.2} -128 Q${o * 1.25} 0 ${o * 0.2} 128`} stroke="#2a0c06" strokeOpacity="0.45" strokeWidth="2.2" fill="none" />
      ))}
      <path d="M-58 -10 Q-50 -110 0 -130" stroke={light} strokeOpacity="0.55" strokeWidth="3" fill="none" />
    </g>
  );
}

export default function ArtVisual({ kind, seed = 1, className = "" }: { kind: VisualKind; seed?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  // Generador nuevo en cada render: el dibujo es determinista (idéntico en SSR y cliente).
  const r = rng(seed * 9973 + kind.length * 131);

  const defs = (
    <defs>
      <radialGradient id={`${uid}-sun`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ffe3a8" stopOpacity="0.95" />
        <stop offset="0.35" stopColor="#e2a85a" stopOpacity="0.45" />
        <stop offset="1" stopColor="#e2a85a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#120a06" />
        <stop offset="0.55" stopColor="#4a2a17" />
        <stop offset="0.8" stopColor="#b9773b" />
        <stop offset="1" stopColor="#d9a35e" />
      </linearGradient>
      <linearGradient id={`${uid}-jungle`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f140d" />
        <stop offset="1" stopColor="#1f2a1b" />
      </linearGradient>
      <linearGradient id={`${uid}-shaft`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f3d79c" stopOpacity="0.35" />
        <stop offset="1" stopColor="#f3d79c" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${uid}-pod`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d18a2c" />
        <stop offset="0.45" stopColor="#8f2c14" />
        <stop offset="1" stopColor="#2d0d07" />
      </linearGradient>
      <radialGradient id={`${uid}-bean`} cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#8a5236" />
        <stop offset="0.6" stopColor="#4a2617" />
        <stop offset="1" stopColor="#1c0d07" />
      </radialGradient>
      <radialGradient id={`${uid}-pulp`} cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="0.7" stopColor="#e6d8bb" />
        <stop offset="1" stopColor="#a8987a" />
      </radialGradient>
      <linearGradient id={`${uid}-choc`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5a3220" />
        <stop offset="0.5" stopColor="#2c170d" />
        <stop offset="1" stopColor="#150a05" />
      </linearGradient>
      <radialGradient id={`${uid}-vig`} cx="50%" cy="45%" r="75%">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.65" />
      </radialGradient>
    </defs>
  );

  let body: React.ReactNode = null;

  switch (kind) {
    case "mountains": {
      const layers = ["#3a2216", "#2a180f", "#1d110a", "#130b07", "#0b0604"];
      body = (
        <>
          <rect width="800" height="1000" fill={`url(#${uid}-sky)`} />
          <circle cx={420 + r() * 120} cy="560" r="260" fill={`url(#${uid}-sun)`} />
          {layers.map((c, i) => (
            <path key={i} d={ridgePath(r, 560 + i * 85, 120 - i * 12)} fill={c} opacity={0.85 + i * 0.03} />
          ))}
          <rect y="610" width="800" height="70" fill="#e9c38a" opacity="0.06" />
        </>
      );
      break;
    }
    case "plantation":
    case "cultivation": {
      const trunks = Array.from({ length: kind === "cultivation" ? 3 : 7 }, () => ({ x: r() * 800, w: 10 + r() * 18 }));
      body = (
        <>
          <rect width="800" height="1000" fill={`url(#${uid}-jungle)`} />
          <polygon points="420,0 560,0 380,1000 120,1000" fill={`url(#${uid}-shaft)`} />
          <polygon points="650,0 720,0 640,1000 520,1000" fill={`url(#${uid}-shaft)`} opacity="0.6" />
          {trunks.map((t, i) => (
            <rect key={i} x={t.x} y="0" width={t.w} height="1000" fill="#0b0805" opacity={0.75} />
          ))}
          {Array.from({ length: 70 }, (_, i) => {
            const x = r() * 800, y = r() * 520, rx = 30 + r() * 60;
            return <ellipse key={i} cx={x} cy={y} rx={rx} ry={rx * 0.35} transform={`rotate(${r() * 180 - 90} ${x} ${y})`} fill={i % 3 ? "#1d2a18" : "#2e3d26"} opacity={0.85} />;
          })}
          {kind === "plantation" &&
            trunks.slice(0, 4).map((t, i) => <Pod key={i} id={uid} x={t.x + t.w / 2 + 14} y={560 + r() * 220} s={0.35 + r() * 0.15} rot={r() * 20 - 10} />)}
          {kind === "cultivation" && (
            <g transform="translate(400 720)">
              <path d="M0 280 Q-8 120 6 -40" stroke="#3f2a18" strokeWidth="10" fill="none" />
              {[-1, 1, -1, 1, -1].map((d, i) => (
                <ellipse key={i} cx={d * 70} cy={-i * 60 + 120} rx="80" ry="24" transform={`rotate(${d * -25} ${d * 70} ${-i * 60 + 120})`} fill="#3d5a2e" opacity="0.95" />
              ))}
            </g>
          )}
          <rect y="880" width="800" height="120" fill="#0c0a06" />
        </>
      );
      break;
    }
    case "pod":
    case "harvest": {
      body = (
        <>
          <rect width="800" height="1000" fill="#110906" />
          <circle cx="560" cy="300" r="380" fill={`url(#${uid}-sun)`} opacity="0.4" />
          <ellipse cx="200" cy="300" rx="240" ry="60" transform="rotate(-30 200 300)" fill="#1f2b19" />
          {kind === "pod" ? (
            <Pod id={uid} x={400} y={520} s={2.4} rot={-18} />
          ) : (
            <>
              <path d="M120 760 Q400 960 680 760 L640 900 Q400 1000 160 900 Z" fill="#3a2516" />
              {[220, 330, 450, 560].map((x, i) => (
                <Pod key={i} id={uid} x={x} y={700 - (i % 2) * 40} s={0.9} rot={-60 + i * 35} />
              ))}
            </>
          )}
        </>
      );
      break;
    }
    case "pulp":
    case "beans":
    case "drying":
    case "fermentation": {
      const pulpy = kind === "pulp";
      const n = kind === "drying" ? 140 : 46;
      const bg = kind === "drying" ? "#6b4a2c" : kind === "fermentation" ? "#24140c" : "#100805";
      body = (
        <>
          <rect width="800" height="1000" fill={bg} />
          {kind === "drying" && <circle cx="650" cy="120" r="420" fill={`url(#${uid}-sun)`} opacity="0.7" />}
          {kind === "drying" && Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0 ${80 * i} Q400 ${80 * i + 30} 800 ${80 * i}`} stroke="#4a301b" strokeWidth="3" fill="none" opacity="0.6" />)}
          {kind === "fermentation" &&
            Array.from({ length: 6 }, (_, i) => <rect key={i} x="0" y={i * 170} width="800" height="160" fill="#3b2415" stroke="#1a0e07" strokeWidth="10" />)}
          {Array.from({ length: n }, (_, i) => {
            const x = r() * 800, y = (kind === "fermentation" ? 300 : 0) + r() * (kind === "fermentation" ? 700 : 1000);
            const s = kind === "drying" ? 0.55 : 1 + r() * 0.5;
            const rot = r() * 180;
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
                <ellipse rx="34" ry="52" fill={`url(#${uid}-${pulpy ? "pulp" : "bean"})`} />
                <path d="M0 -48 Q6 0 0 48" stroke={pulpy ? "#bfae8c" : "#1a0b05"} strokeWidth="2" fill="none" opacity="0.7" />
              </g>
            );
          })}
          {kind === "fermentation" &&
            [200, 400, 600].map((x, i) => <path key={i} d={`M${x} 300 C${x - 40} 220 ${x + 40} 160 ${x} 60`} stroke="#f3e2c0" strokeOpacity="0.18" strokeWidth="14" strokeLinecap="round" fill="none" />)}
        </>
      );
      break;
    }
    case "transformation": {
      body = (
        <>
          <rect width="800" height="1000" fill="#160b06" />
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx="400" cy="520" r={40 + i * 26} stroke={i % 4 === 0 ? "#c9a96e" : "#4a2a19"} strokeOpacity={i % 4 === 0 ? 0.5 : 0.8} strokeWidth={i % 4 === 0 ? 1.5 : 12} fill="none" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M${-50 + i * 30} ${200 + i * 140} C 250 ${100 + i * 160}, 550 ${400 + i * 90}, 860 ${260 + i * 150}`} stroke="#6d3b22" strokeWidth={22 - i * 3} strokeLinecap="round" fill="none" opacity="0.7" />
          ))}
        </>
      );
      break;
    }
    case "chocolate": {
      body = (
        <>
          <rect width="800" height="1000" fill="#0f0705" />
          <circle cx="250" cy="200" r="400" fill={`url(#${uid}-sun)`} opacity="0.25" />
          <g transform="translate(160 220) rotate(-8)">
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i} transform={`translate(${(i % 3) * 165} ${Math.floor(i / 3) * 165})`}>
                <rect width="155" height="155" rx="6" fill={`url(#${uid}-choc)`} />
                <rect x="14" y="14" width="127" height="127" rx="4" fill="none" stroke="#7a4a2e" strokeOpacity="0.55" strokeWidth="2" />
                <path d="M6 6 L149 6" stroke="#c99a6b" strokeOpacity="0.35" strokeWidth="2" />
              </g>
            ))}
          </g>
        </>
      );
      break;
    }
    case "texture":
    default: {
      body = (
        <>
          <rect width="800" height="1000" fill="#1a0e08" />
          {Array.from({ length: 34 }, (_, i) => (
            <path key={i} d={`M-20 ${i * 32} C 200 ${i * 32 - 40 + r() * 30}, 520 ${i * 32 + 50 - r() * 30}, 820 ${i * 32}`} stroke={i % 5 === 0 ? "#c9a96e" : "#3a2216"} strokeOpacity={i % 5 === 0 ? 0.35 : 0.9} strokeWidth={i % 5 === 0 ? 1.2 : 14} fill="none" />
          ))}
        </>
      );
    }
  }

  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} role="img" aria-hidden>
      {defs}
      {body}
      <rect width="800" height="1000" fill={`url(#${uid}-vig)`} />
    </svg>
  );
}
