"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import CacaoPod, { type PodControls } from "./CacaoPod";
import { experience, smoothstep } from "@/lib/experience-state";
import { gsap } from "@/lib/gsap";

/** Pesos de visibilidad de cada escena que usa el universo 3D. */
function weights() {
  const hero = 1 - smoothstep(0, 1, experience.heroOut);
  const pod = smoothstep(0, 1, experience.podEnter) * (1 - smoothstep(0, 1, experience.podExit));
  const close = smoothstep(0, 1, experience.closeEnter);
  return { hero, pod, close, max: Math.max(hero, pod, close) };
}

const damp = THREE.MathUtils.damp;

function Scene({ mobile }: { mobile: boolean }) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const key = useRef<THREE.SpotLight>(null);
  const controls = useRef<PodControls>({ open: 0, burst: 0 });
  const intro = useRef(0);
  const { camera } = useThree();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const w = weights();
    const sum = w.hero + w.pod + w.close || 1;
    const p = experience.pod;

    intro.current = damp(intro.current, experience.ready ? 1 : 0, 1.6, dt);
    const ease = 1 - Math.pow(1 - intro.current, 3);

    // ── Poses objetivo por escena ───────────────────────────────
    const float = Math.sin(t * 0.7) * 0.08;
    const hero = {
      x: mobile ? 0 : 1.45, y: (mobile ? 0.95 : 0) + float, z: 0,
      rz: mobile ? 0.5 : 0.42, ry: t * 0.18, s: mobile ? 0.62 : 1,
    };
    const horizontal = mobile ? 0.1 : Math.PI / 2 - 0.08;
    const approach = smoothstep(0, 0.25, p);
    const pod = {
      x: 0, y: Math.sin(t * 0.5) * 0.03, z: 0,
      rz: THREE.MathUtils.lerp(0.5, horizontal, approach),
      // Gira hasta mostrar la línea de apertura de frente.
      ry: THREE.MathUtils.lerp(-1.4, 0, smoothstep(0, 0.3, p)) + Math.sin(t * 0.3) * 0.05,
      s: (mobile ? 0.62 : 1.05) + approach * (mobile ? 0.1 : 0.2),
    };
    const close = { x: 0, y: (mobile ? 0.45 : 0.5) + float, z: 0, rz: mobile ? 0.5 : Math.PI / 2 - 0.25, ry: t * 0.12, s: mobile ? 0.5 : 0.62 };

    const mix = (k: keyof typeof hero) => (hero[k] * w.hero + pod[k] * w.pod + close[k] * w.close) / sum;

    const g = root.current;
    if (g) {
      g.position.x = damp(g.position.x, mix("x"), 3, dt);
      g.position.y = damp(g.position.y, mix("y") - (1 - ease) * 1.2, 3, dt);
      g.rotation.z = damp(g.rotation.z, mix("rz"), 3, dt);
      g.rotation.y = damp(g.rotation.y, mix("ry"), 3, dt);
      g.scale.setScalar(damp(g.scale.x, mix("s") * (0.6 + 0.4 * ease), 3, dt));
    }

    // Reacción al cursor (sutil, como si el objeto respirara con el usuario).
    if (tilt.current) {
      tilt.current.rotation.x = damp(tilt.current.rotation.x, experience.mouseY * 0.18, 2.5, dt);
      tilt.current.rotation.y = damp(tilt.current.rotation.y, experience.mouseX * 0.28, 2.5, dt);
    }

    // Apertura y liberación de granos sólo en la escena de la mazorca.
    const podW = w.pod / sum;
    controls.current.open = damp(controls.current.open, smoothstep(0.22, 0.5, p) * podW, 4, dt);
    controls.current.burst = damp(controls.current.burst, smoothstep(0.58, 0.9, p) * podW, 4, dt);

    // Cámara: dolly cinematográfico hacia el interior.
    const dive = smoothstep(0.55, 1, p) * podW;
    const camZ = (mobile ? 7.2 : 6) - dive * (mobile ? 1.6 : 1.9);
    camera.position.x = damp(camera.position.x, experience.mouseX * 0.25, 2, dt);
    camera.position.y = damp(camera.position.y, -experience.mouseY * 0.15, 2, dt);
    camera.position.z = damp(camera.position.z, camZ, 2.5, dt);
    camera.lookAt(0, 0, 0);

    if (key.current) key.current.intensity = 60 + Math.sin(t * 0.6) * 6;
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#ffe2c0" />
      <spotLight ref={key} position={[4, 5, 5]} angle={0.5} penumbra={1} intensity={60} color="#ffd6a0" />
      <pointLight position={[-4, 1.5, -3]} intensity={30} color="#c9a96e" />
      <pointLight position={[0, -3, 2]} intensity={4} color="#7a4a2a" />
      <directionalLight position={[-2, 3, 4]} intensity={0.4} color="#fff1dc" />

      {/* Reflejos locales (sin HDRI externo) */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffd9a8" position={[3, 3, 3]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#c9a96e" position={[-4, 0, -2]} scale={[2, 5, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#ffffff" position={[0, 4, -4]} scale={2} />
      </Environment>

      <group ref={root}>
        <group ref={tilt}>
          <CacaoPod controls={controls} beans={mobile ? 36 : 48} />
        </group>
      </group>

      <Sparkles count={mobile ? 40 : 90} scale={[12, 7, 6]} size={mobile ? 2 : 2.6} speed={0.25} opacity={0.55} color="#e4c98f" noise={0.6} />
    </>
  );
}

/**
 * Lienzo WebGL fijo detrás del contenido. Su opacidad (y si renderiza o no)
 * depende de qué escena está activa, de modo que la mazorca acompaña la
 * navegación: hero → apertura → cierre, con un único contexto WebGL.
 */
export default function Experience() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const upd = () => setMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);

    let last = true;
    const tick = () => {
      const { max } = weights();
      if (wrap.current) wrap.current.style.opacity = String(max);
      const on = max > 0.001;
      if (on !== last) {
        last = on;
        setActive(on);
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      mq.removeEventListener("change", upd);
    };
  }, []);

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, mobile ? 1.4 : 1.8]}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <Scene mobile={mobile} />
      </Canvas>
    </div>
  );
}
