"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImagenItem } from "@/lib/types";

export default function HeroCarousel({ imagenes }: { imagenes: ImagenItem[] }) {
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    if (imagenes.length < 2) return;
    const id = setInterval(() => setActiva((i) => (i + 1) % imagenes.length), 3200);
    return () => clearInterval(id);
  }, [imagenes.length]);

  if (imagenes.length === 0) {
    return (
      <div className="hero-media">
        <span className="ph">Imagen hero<br />3-5 fotos en rotación (fade)<br />pendiente §7</span>
      </div>
    );
  }

  return (
    <div className="hero-media" style={{ position: "relative", overflow: "hidden" }}>
      {imagenes.map((foto, i) => (
        <Image
          key={foto.url}
          src={foto.url}
          alt={foto.alt}
          fill
          priority={i === 0}
          sizes="(max-width: 900px) 100vw, 45vw"
          style={{ objectFit: "cover", opacity: i === activa ? 1 : 0, transition: "opacity 1.1s ease" }}
        />
      ))}
    </div>
  );
}
