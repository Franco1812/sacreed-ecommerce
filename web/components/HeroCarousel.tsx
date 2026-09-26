"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImagenItem } from "@/lib/types";

/** Fotos del hero a ancho completo, en rotación (fade). Sin fotos cargadas no renderiza nada: el hero queda en color liso. */
export default function HeroCarousel({ imagenes }: { imagenes: ImagenItem[] }) {
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    if (imagenes.length < 2) return;
    const id = setInterval(() => setActiva((i) => (i + 1) % imagenes.length), 5200);
    return () => clearInterval(id);
  }, [imagenes.length]);

  if (imagenes.length === 0) return null;

  return (
    <div className="hero-photos" aria-hidden={imagenes.length > 1 ? true : undefined}>
      {imagenes.map((foto, i) => (
        <Image
          key={foto.url}
          src={foto.url}
          alt={foto.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          style={{ objectFit: "cover", opacity: i === activa ? 1 : 0, transition: "opacity 1.1s ease" }}
        />
      ))}
    </div>
  );
}
