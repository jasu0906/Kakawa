/**
 * Estado mutable compartido entre el DOM (ScrollTrigger) y la escena WebGL.
 * Se usa un objeto plano en lugar de estado React para evitar re-renders
 * en cada frame de scroll: el canvas lo lee dentro de useFrame.
 */
export const experience = {
  /** 0 → 1 mientras el hero sale de pantalla. */
  heroOut: 0,
  /** 0 → 1 cuando la escena de la mazorca entra al viewport. */
  podEnter: 0,
  /** 0 → 1 progreso de la escena fijada (apertura de la mazorca). */
  pod: 0,
  /** 0 → 1 cuando la escena de la mazorca sale. */
  podExit: 0,
  /** 0 → 1 cuando el cierre entra al viewport. */
  closeEnter: 0,
  /** Cursor normalizado −1 … 1. */
  mouseX: 0,
  mouseY: 0,
  /** Cambia a true al terminar el preloader (dispara la entrada del hero). */
  ready: false,
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
