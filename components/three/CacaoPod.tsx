"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPodShell, beanLayout, POD_LENGTH, POD_RADIUS } from "./podGeometry";

export interface PodControls {
  /** 0 cerrada → 1 abierta. */
  open: number;
  /** 0 granos en su sitio → 1 granos suspendidos alrededor. */
  burst: number;
}

const UP = new THREE.Vector3(0, 1, 0);
const BEAN_PULP = new THREE.Color("#efe5cf");
const BEAN_FRESH = new THREE.Color("#6e2b3c");
const BEAN_DRY = new THREE.Color("#4b2a1b");

/**
 * Mazorca de cacao 3D: dos mitades de cáscara, pulpa y granos instanciados.
 * Los valores de apertura llegan por `controls` (un ref mutable) para no re-renderizar.
 */
export default function CacaoPod({ controls, beans = 48 }: { controls: React.RefObject<PodControls>; beans?: number }) {
  const halfA = useRef<THREE.Group>(null);
  const halfB = useRef<THREE.Group>(null);
  const pulp = useRef<THREE.Mesh>(null);
  const beanMesh = useRef<THREE.InstancedMesh>(null);

  const { shellA, shellB } = useMemo(
    () => ({
      shellA: createPodShell(-Math.PI / 2, Math.PI / 2),
      shellB: createPodShell(Math.PI / 2, (3 * Math.PI) / 2),
    }),
    [],
  );

  const layout = useMemo(() => beanLayout(beans), [beans]);
  const beanGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 22, 16);
    // Grano: ligeramente aplanado y asimétrico.
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      p.setX(i, p.getX(i) * (1 - 0.18 * y));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const shellMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.55,
        metalness: 0.0,
        clearcoat: 0.35,
        clearcoatRoughness: 0.45,
        sheen: 0.4,
        sheenColor: new THREE.Color("#ffb070"),
      }),
    [],
  );
  const liningMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d9cbb5", roughness: 1, envMapIntensity: 0.25, side: THREE.BackSide }),
    [],
  );
  const pulpMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#efe6d4",
        roughness: 0.55,
        sheen: 1,
        sheenColor: new THREE.Color("#fff6e0"),
        clearcoat: 0.2,
        transparent: true,
      }),
    [],
  );
  const beanMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
    [],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const qAlign = useMemo(() => new THREE.Quaternion(), []);
  const qSpin = useMemo(() => new THREE.Quaternion(), []);
  const eSpin = useMemo(() => new THREE.Euler(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const hinge = POD_RADIUS * 0.95;

  // Inicializa los colores por instancia antes del primer render (evita recompilar el shader).
  useLayoutEffect(() => {
    const bm = beanMesh.current;
    if (!bm) return;
    for (let i = 0; i < layout.length; i++) bm.setColorAt(i, BEAN_PULP);
    if (bm.instanceColor) bm.instanceColor.needsUpdate = true;
    beanMat.needsUpdate = true;
  }, [layout, beanMat]);

  useFrame((state) => {
    const { open, burst } = controls.current ?? { open: 0, burst: 0 };
    const t = state.clock.elapsedTime;

    // Apertura tipo libro: bisagra en el dorso (z negativo).
    // Al liberar los granos, las mitades se retiran fuera de cuadro.
    const ang = open * 1.05 + burst * 0.5;
    const away = open * 0.12 + burst * burst * 2.6;
    if (halfA.current) {
      halfA.current.rotation.y = ang;
      halfA.current.position.x = away;
      halfA.current.position.z = -burst * 1.2;
    }
    if (halfB.current) {
      halfB.current.rotation.y = -ang;
      halfB.current.position.x = -away;
      halfB.current.position.z = -burst * 1.2;
    }

    // Pulpa: visible al abrir, se disuelve cuando los granos se liberan.
    if (pulp.current) {
      const s = Math.max(0.0001, 1 - burst * 0.95);
      pulp.current.scale.set(POD_RADIUS * 0.3 * s, (POD_LENGTH / 2) * 0.7 * s, POD_RADIUS * 0.3 * s);
      pulpMat.opacity = Math.min(1, open * 2) * Math.pow(1 - burst, 2);
      pulp.current.visible = pulpMat.opacity > 0.05;
    }

    const bm = beanMesh.current;
    if (!bm) return;
    layout.forEach((b, i) => {
      const seed = i * 12.9898;
      const rnd = Math.sin(seed) * 0.5 + 0.5;
      // Liberación: los granos salen hacia la cámara y quedan suspendidos en órbita lenta.
      const spread = burst * (0.9 + rnd * 1.5);
      const orbit = burst * (t * 0.12 + i * 0.37);
      let x = b.pos.x + b.dir.x * spread;
      let z = b.pos.z + b.dir.z * spread;
      const co = Math.cos(orbit), so = Math.sin(orbit);
      const ox = x * co - z * so, oz = x * so + z * co;
      x = THREE.MathUtils.lerp(b.pos.x, ox, burst);
      z = THREE.MathUtils.lerp(b.pos.z, oz, burst) + burst * 0.6;
      const y = b.pos.y * (1 + burst * 0.55) + Math.sin(t * 0.8 + seed) * 0.07 * burst;
      dummy.position.set(x, y, z);

      // Eje largo del grano apuntando hacia la cáscara, luego libre al flotar.
      qAlign.setFromUnitVectors(UP, b.dir);
      qSpin.setFromEuler(eSpin.set(b.tilt + burst * (t * 0.35 + seed), burst * (t * 0.25 + rnd * 3), b.tilt));
      dummy.quaternion.copy(qAlign).multiply(qSpin);

      const sc = (open < 0.02 ? 0.0001 : 1) * (1 + burst * 0.15);
      dummy.scale.set(0.105 * sc, 0.17 * sc, 0.075 * sc);
      dummy.updateMatrix();
      bm.setMatrixAt(i, dummy.matrix);

      // Del blanco de la pulpa → violeta fresco → marrón seco.
      const c1 = THREE.MathUtils.smoothstep(burst, 0.0, 0.55);
      const c2 = THREE.MathUtils.smoothstep(burst, 0.5, 1.0);
      tmpColor.copy(BEAN_PULP).lerp(BEAN_FRESH, c1).lerp(BEAN_DRY, c2);
      bm.setColorAt(i, tmpColor);
    });
    bm.instanceMatrix.needsUpdate = true;
    if (bm.instanceColor) bm.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {/* Mitad A (+x) con pivote en el dorso */}
      <group position={[0, 0, -hinge]}>
        <group ref={halfA}>
          <group position={[0, 0, hinge]}>
            <mesh geometry={shellA} material={shellMat} castShadow />
            <mesh geometry={shellA} material={liningMat} />
          </group>
        </group>
      </group>
      {/* Mitad B (−x) */}
      <group position={[0, 0, -hinge]}>
        <group ref={halfB}>
          <group position={[0, 0, hinge]}>
            <mesh geometry={shellB} material={shellMat} castShadow />
            <mesh geometry={shellB} material={liningMat} />
          </group>
        </group>
      </group>

      {/* Pulpa */}
      <mesh ref={pulp} material={pulpMat}>
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>

      {/* Granos */}
      <instancedMesh ref={beanMesh} args={[beanGeo, beanMat, layout.length]} frustumCulled={false} />
    </group>
  );
}
