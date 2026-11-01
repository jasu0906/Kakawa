"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./ui/Preloader";
import Cursor from "./ui/Cursor";
import Nav from "./ui/Nav";
import Hero from "./scenes/Hero";
import Origin from "./scenes/Origin";
import PodScene from "./scenes/PodScene";
import Process from "./scenes/Process";
import Identity from "./scenes/Identity";
import Gallery from "./scenes/Gallery";
import Products from "./scenes/Products";
import Closing from "./scenes/Closing";

// El universo 3D sólo se carga en el cliente.
const Experience = dynamic(() => import("./three/Experience"), { ssr: false });

export default function ExperienceShell() {
  useEffect(() => {
    // Recalcular posiciones cuando las fuentes y el preloader terminan.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("kakawa:ready", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("kakawa:ready", refresh);
  }, []);

  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Experience />
      <Nav />
      <main className="relative">
        <Hero />
        <Origin />
        <PodScene />
        <Process />
        <Identity />
        <Gallery />
        <Products />
        <Closing />
      </main>
      <div className="grain" aria-hidden />
    </SmoothScroll>
  );
}
