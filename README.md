# KAKAWA — Experiencia web inmersiva

Experiencia digital premium para **KAKAWA · cacao venezolano**.
Next.js 15 · React 19 · TypeScript · Tailwind CSS · Three.js / React Three Fiber · GSAP + ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Narrativa (8 escenas)

La **mazorca 3D es el hilo conductor**: vive en un único lienzo WebGL fijo
(`components/three/Experience.tsx`) y cambia de pose según la escena activa.

| # | Escena | Archivo | Recursos clave |
|---|--------|---------|----------------|
| 1 | Hero cinematográfico | `scenes/Hero.tsx` | Mazorca flotante, partículas, reacción al cursor, tipografía animada |
| 2 | El origen | `scenes/Origin.tsx` | Sección fija, revelado por máscara + Ken Burns sincronizados con el scroll |
| 3 | La mazorca 3D | `scenes/PodScene.tsx` | Scroll → acercamiento, apertura, pulpa, liberación de granos (blanco → violeta → marrón) |
| 4 | Del cacao al chocolate | `scenes/Process.tsx` | 8 etapas en recorrido horizontal fijado, hilo dorado conductor (vertical en móvil) |
| 5 | Identidad KAKAWA | `scenes/Identity.tsx` | Logotipo, pilares, paleta |
| 6 | Galería | `scenes/Gallery.tsx` | Inclinación 3D al cursor, visor a pantalla completa con teclado |
| 7 | Productos | `scenes/Products.tsx` | Vitrinas con profundidad por capas (sólo productos reales) |
| 8 | Cierre | `scenes/Closing.tsx` | Regreso de la mazorca, firma, redes/contacto oficiales |

La mazorca es **procedural** (`components/three/podGeometry.ts`): perfil
alargado, 10 surcos, rugosidad y color por vértice. No necesita modelos
externos. Si se dispone de un modelo `.glb` fotogramétrico se puede sustituir
en `CacaoPod.tsx`.

## Contenido y material oficial

Todo el contenido vive en **`content/site.ts`**. No se ha inventado ningún dato
sobre KAKAWA: los campos vacíos muestran estados provisionales etiquetados.

### Material pendiente

- [ ] **Videos de referencia**: para afinar animaciones, transiciones y ritmo.
- [ ] **Logotipo oficial** (SVG o PNG transparente) → `public/assets/brand/` y `brand.logo`.
  Mientras tanto se muestra un *wordmark provisional* tipográfico neutro.
- [ ] **Colores y tipografías oficiales**: la paleta actual es de diseño web y se ajustará.
- [ ] **Filosofía de marca**: los pilares *Origen / Tradición / Excelencia* son una propuesta editorial.
- [ ] **Productos reales** (foto con fondo transparente, nombre, descripción, presentación) → `products`.
- [ ] **Fotografías**: plantaciones, paisajes, mazorcas, granos, procesos, empaques
  → `public/assets/{origin,process,gallery}/` y el campo `src` de cada visual.
- [ ] **Redes sociales, correo y teléfono oficiales** → `brand.socials`, `brand.email`, `brand.phone`.
  Sin datos, no se muestran enlaces (ningún botón queda sin función).

Mientras falten fotografías, se usan **ilustraciones generativas en SVG**
(`components/ui/ArtVisual.tsx`) con la etiqueta *“Visual provisional”*: mantienen
la dirección de arte sin hacerse pasar por fotografía real de la empresa.

## Rendimiento y accesibilidad

- Un solo contexto WebGL; deja de renderizar cuando ninguna escena 3D es visible.
- Sin HDRI externo (reflejos con `Lightformer` locales); fuentes autoalojadas.
- Móvil: menos granos y partículas, DPR limitado, mazorca vertical, proceso en vertical.
- `prefers-reduced-motion`: desactiva scroll suave, preloader y animaciones de entrada.
- Cursor personalizado sólo en punteros finos; navegación y visor operables con teclado.
