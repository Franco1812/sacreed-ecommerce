"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icons";

type Foto = { url: string; alt: string };

/**
 * Fotos de la tarjeta de producto: con más de una foto se pasan con flechas (en desktop aparecen al
 * pasar el mouse) y puntos. No es un scroll táctil a propósito: la tarjeta suele vivir dentro de un
 * carrusel que ya se desliza con el dedo, y dos scrolls horizontales anidados se pelean.
 */
export default function CardFotos({ fotos, href, badge }: { fotos: Foto[]; href: string; badge?: string | null }) {
  const [i, setI] = useState(0);
  const n = fotos.length;
  const mover = (d: number) => setI((prev) => (prev + d + n) % n);

  return (
    <div className="card-media">
      <Link href={href} className="card-media-link" tabIndex={-1} aria-hidden="true">
        {fotos.map((f, k) => (
          <Image
            key={f.url}
            src={f.url}
            alt={f.alt}
            fill
            sizes="(max-width: 680px) 45vw, (max-width: 1000px) 30vw, 220px"
            className={k === i ? "on" : undefined}
            style={{ objectFit: "cover" }}
          />
        ))}
      </Link>
      {badge && <span className="badge">{badge}</span>}
      {n > 1 && (
        <>
          <button type="button" className="card-foto-arrow prev" aria-label="Foto anterior" onClick={() => mover(-1)}>
            <Icon name="chevron-left" />
          </button>
          <button type="button" className="card-foto-arrow next" aria-label="Foto siguiente" onClick={() => mover(1)}>
            <Icon name="chevron-right" />
          </button>
          <div className="card-foto-dots" aria-hidden="true">
            {fotos.map((f, k) => (
              <i key={f.url} className={k === i ? "on" : undefined} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
