import * as THREE from "three";

/**
 * Geometría procedural de una mazorca de cacao (tipo criollo/trinitario):
 * cuerpo alargado, punta inferior aguzada, 10 surcos longitudinales y
 * una superficie rugosa. Se genera por mitades para poder "abrirla".
 */

export const POD_LENGTH = 2.6;
export const POD_RADIUS = 0.62;

// Ruido determinista barato (suma de senos) para la rugosidad.
function bumps(u: number, v: number) {
  return (
    Math.sin(u * 47.0 + Math.sin(v * 3.0) * 2.0) * Math.sin(v * 23.0 + u * 5.0) * 0.5 +
    Math.sin(u * 91.0 - v * 11.0) * 0.25 +
    Math.sin(u * 13.0 + v * 37.0) * 0.25
  );
}

/** Radio de la mazorca en función de la altura normalizada u (0 abajo → 1 arriba) y el ángulo v. */
export function podRadius(u: number, v: number) {
  // Perfil: punta aguda abajo, hombro redondeado arriba.
  const s = Math.sin(Math.PI * Math.pow(u, 0.92));
  const profile = Math.pow(s, 0.72) * (1 - 0.28 * Math.pow(1 - u, 4));
  // 10 surcos: crestas suaves y valles marcados.
  const ridge = Math.pow(0.5 + 0.5 * Math.cos(v * 10.0), 0.8);
  const ridges = 0.9 + 0.13 * ridge;
  const rough = 1 + 0.018 * bumps(u, v) * (0.4 + ridge);
  return POD_RADIUS * profile * ridges * rough;
}

/** Ligera curvatura de la punta (las mazorcas reales no son perfectamente rectas). */
function bend(u: number) {
  return 0.12 * Math.pow(1 - u, 3);
}

const C_DEEP = new THREE.Color("#4a140c");
const C_RED = new THREE.Color("#8c2a14");
const C_OCHRE = new THREE.Color("#c27a26");
const C_TIP = new THREE.Color("#2a0d07");

/**
 * Construye una mitad (o la pieza completa) de la cáscara.
 * @param v0 ángulo inicial, @param v1 ángulo final.
 */
export function createPodShell(v0: number, v1: number, segU = 120, segV = 72) {
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const col = new THREE.Color();

  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    const y = (u - 0.5) * POD_LENGTH;
    const bx = bend(u);
    for (let j = 0; j <= segV; j++) {
      const v = v0 + (j / segV) * (v1 - v0);
      const r = podRadius(u, v);
      positions.push(Math.cos(v) * r + bx, y, Math.sin(v) * r);

      // Color: crestas ocre-rojizas, valles profundos, puntas oscuras.
      const ridge = Math.pow(0.5 + 0.5 * Math.cos(v * 10.0), 1.4);
      const mid = Math.sin(Math.PI * u);
      col.copy(C_DEEP).lerp(C_RED, 0.35 + 0.65 * ridge);
      col.lerp(C_OCHRE, 0.45 * ridge * mid * (0.6 + 0.4 * Math.sin(v * 1.0 + 1.2)));
      col.lerp(C_TIP, Math.pow(1 - mid, 3) * 0.85);
      const n = 0.92 + 0.08 * bumps(u * 1.7, v * 1.3);
      colors.push(col.r * n, col.g * n, col.b * n);
      uvs.push(j / segV, u);
    }
  }

  const row = segV + 1;
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * row + j;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Posiciones de los granos: columnas apretadas alrededor de la placenta
 * central, con el eje largo de cada grano orientado hacia la cáscara
 * (como en una mazorca real abierta).
 */
export function beanLayout(count: number) {
  const cols = 6;
  const perCol = Math.ceil(count / cols);
  const out: { pos: THREE.Vector3; dir: THREE.Vector3; tilt: number; u: number }[] = [];
  for (let c = 0; c < cols; c++) {
    for (let k = 0; k < perCol && out.length < count; k++) {
      const u = 0.16 + (k / (perCol - 1)) * 0.68;
      const ang = (c / cols) * Math.PI * 2 + (k % 2) * (Math.PI / cols);
      const inner = podRadius(u, ang);
      const r = inner * 0.5;
      const y = (u - 0.5) * POD_LENGTH;
      const dir = new THREE.Vector3(Math.cos(ang), (u - 0.5) * 0.35, Math.sin(ang)).normalize();
      out.push({
        pos: new THREE.Vector3(Math.cos(ang) * r + bend(u), y, Math.sin(ang) * r),
        dir,
        tilt: ((k * 7 + c * 3) % 5) * 0.08 - 0.16,
        u,
      });
    }
  }
  return out;
}
