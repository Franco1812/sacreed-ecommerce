"use client";

import { Children, useRef } from "react";
import Icon from "@/components/Icons";

/**
 * Carrusel a ancho completo: scroll horizontal con snap y flechas cuadradas.
 * El ancho de cada tarjeta lo fija el CSS (.carousel-track > *) para que se vea
 * asomar la siguiente.
 */
export default function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const pista = useRef<HTMLDivElement>(null);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Con 5 tarjetas o menos entran todas en pantalla: se centran y no hacen falta flechas.
  const corto = Children.count(children) <= 5;

  return (
    <div className={`carousel${corto ? " is-short" : ""}`} role="region" aria-label={label}>
      <button type="button" className="carousel-arrow prev" aria-label="Anterior" onClick={() => mover(-1)}>
        <Icon name="chevron-left" />
      </button>
      <div className="carousel-track" ref={pista}>
        {children}
      </div>
      <button type="button" className="carousel-arrow next" aria-label="Siguiente" onClick={() => mover(1)}>
        <Icon name="chevron-right" />
      </button>
    </div>
  );
}
