/**
 * KAKAWA — contenido centralizado.
 *
 * REGLA: aquí sólo debe vivir información oficial de la marca.
 * Todo campo que esté en `null` o en un arreglo vacío significa
 * "material oficial pendiente": la interfaz lo detecta y muestra
 * un estado provisional elegante (sin inventar datos ni enlaces).
 *
 * Para reemplazar un visual provisional basta con colocar el archivo
 * en /public/assets/... y escribir su ruta en `src`.
 */

export type VisualKind =
  | "mountains"
  | "plantation"
  | "pod"
  | "pulp"
  | "beans"
  | "fermentation"
  | "drying"
  | "transformation"
  | "chocolate"
  | "texture"
  | "harvest"
  | "cultivation";

export interface Visual {
  /** Ruta a la fotografía/video oficial. `null` = visual provisional. */
  src: string | null;
  /** Tipo de visual provisional (ilustración generativa) mientras falta `src`. */
  kind: VisualKind;
  alt: string;
}

export interface Product {
  name: string;
  description: string;
  presentation: string;
  image: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const brand = {
  name: "KAKAWA",
  /** Logotipo oficial (SVG o PNG transparente). `null` = se muestra el wordmark provisional. */
  logo: null as string | null,
  tagline: "El origen de lo extraordinario",
  /** Redes oficiales. Vacío = no se muestran enlaces (no se inventan cuentas). */
  socials: [] as SocialLink[],
  /** Correo oficial de contacto. `null` = oculto. */
  email: null as string | null,
  /** Teléfono / WhatsApp oficial. `null` = oculto. */
  phone: null as string | null,
};

export const hero = {
  kicker: "Cacao venezolano",
  title: "El origen de lo extraordinario",
  subtitle:
    "Una historia que nace en la tierra venezolana y se transforma en una experiencia única.",
  cta: "Descubrir la historia",
};

/** Escena 2 — El origen. Textos evocativos, sin datos inventados sobre KAKAWA. */
export const origin: { eyebrow: string; title: string; text: string; visual: Visual }[] = [
  {
    eyebrow: "I · La tierra",
    title: "Donde la montaña encuentra el trópico",
    text: "Valles húmedos, sombra generosa y una tierra que guarda el calor del día.",
    visual: { src: null, kind: "mountains", alt: "Paisaje montañoso venezolano" },
  },
  {
    eyebrow: "II · La plantación",
    title: "Bajo la sombra, crece la paciencia",
    text: "El árbol de cacao florece despacio, protegido por el bosque que lo rodea.",
    visual: { src: null, kind: "plantation", alt: "Plantación de cacao bajo sombra" },
  },
  {
    eyebrow: "III · La mazorca",
    title: "Un fruto que nace del tronco",
    text: "Las mazorcas brotan directamente de la corteza, como joyas de la selva.",
    visual: { src: null, kind: "pod", alt: "Mazorca de cacao en el árbol" },
  },
  {
    eyebrow: "IV · El legado",
    title: "Un cacao con nombre propio",
    text: "Venezuela es tierra de cacao fino de aroma, reconocido en el mundo por su complejidad.",
    visual: { src: null, kind: "texture", alt: "Detalle de textura de cacao" },
  },
];

/** Escena 3 — Capítulos de la mazorca 3D (sincronizados con el scroll). */
export const podChapters = [
  { label: "01", title: "La cáscara", text: "Surcos profundos que protegen un tesoro." },
  { label: "02", title: "La apertura", text: "El fruto se abre y revela su interior." },
  { label: "03", title: "La pulpa", text: "Blanca, dulce y fresca: el primer aroma." },
  { label: "04", title: "Los granos", text: "Semillas que guardan el alma del chocolate." },
];

/** Escena 4 — Del cacao al chocolate. */
export const process: { title: string; text: string; visual: Visual }[] = [
  { title: "Cultivo", text: "El árbol crece a la sombra, cuidado año tras año.", visual: { src: null, kind: "cultivation", alt: "Cultivo de cacao" } },
  { title: "Recolección", text: "Cada mazorca se corta a mano, en su punto exacto.", visual: { src: null, kind: "harvest", alt: "Recolección de mazorcas" } },
  { title: "Apertura", text: "Un corte preciso abre el fruto sin dañar el grano.", visual: { src: null, kind: "pod", alt: "Apertura de la mazorca" } },
  { title: "Extracción", text: "Los granos, envueltos en pulpa, se separan con cuidado.", visual: { src: null, kind: "pulp", alt: "Extracción de granos" } },
  { title: "Fermentación", text: "Días de calma donde nacen los aromas.", visual: { src: null, kind: "fermentation", alt: "Fermentación del cacao" } },
  { title: "Secado", text: "El sol termina lo que la tierra comenzó.", visual: { src: null, kind: "drying", alt: "Secado de granos al sol" } },
  { title: "Transformación", text: "Tostado, molienda y tiempo: el grano se vuelve materia noble.", visual: { src: null, kind: "transformation", alt: "Transformación del cacao" } },
  { title: "Producto final", text: "Una experiencia que conserva la memoria de su origen.", visual: { src: null, kind: "chocolate", alt: "Chocolate terminado" } },
];

/** Escena 6 — Galería. */
export const gallery: (Visual & { caption: string; span?: "tall" | "wide" })[] = [
  { src: null, kind: "pod", alt: "Mazorca", caption: "Mazorca", span: "tall" },
  { src: null, kind: "beans", alt: "Granos de cacao", caption: "Granos" },
  { src: null, kind: "plantation", alt: "Plantación", caption: "Plantación", span: "wide" },
  { src: null, kind: "mountains", alt: "Paisaje venezolano", caption: "Paisaje" },
  { src: null, kind: "drying", alt: "Secado artesanal", caption: "Proceso artesanal", span: "tall" },
  { src: null, kind: "chocolate", alt: "Chocolate", caption: "Chocolate" },
  { src: null, kind: "texture", alt: "Texturas", caption: "Texturas", span: "wide" },
  { src: null, kind: "pulp", alt: "Pulpa de cacao", caption: "Pulpa" },
];

/**
 * Escena 7 — Productos REALES de KAKAWA.
 * Vacío a propósito: no se inventan productos. Agregar aquí los oficiales:
 * { name, description, presentation, image: "/assets/products/archivo.png" }
 */
export const products: Product[] = [];

export const closing = {
  title: "El cacao venezolano tiene una historia que contar",
  signature: "KAKAWA. El origen de una experiencia extraordinaria.",
};

export const palette = [
  { name: "Cacao profundo", hex: "#140B07" },
  { name: "Chocolate", hex: "#3A2216" },
  { name: "Tierra", hex: "#8A5A3B" },
  { name: "Champagne", hex: "#C9A96E" },
  { name: "Beige natural", hex: "#D8C6A5" },
  { name: "Crema", hex: "#F3EAD9" },
  { name: "Selva", hex: "#2C3A28" },
];
