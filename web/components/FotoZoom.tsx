"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";

/**
 * Foto de la ficha con lupa: al pasar el mouse se amplía y sigue al cursor, para poder leer
 * la etiqueta del envase. La versión en alta resolución recién se pide la primera vez que se
 * pasa por encima. En pantallas táctiles no hace nada (ahí se agranda con los dedos).
 */
export default function FotoZoom({
  src,
  alt,
  sizes,
  sizesZoom,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** `sizes` de la versión ampliada (~2× el tamaño en pantalla). */
  sizesZoom: string;
  priority?: boolean;
}) {
  const [ampliada, setAmpliada] = useState(false);
  const [cargarGrande, setCargarGrande] = useState(false);
  const [origen, setOrigen] = useState("50% 50%");

  const seguir = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigen(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      className={`pdp-zoom${ampliada ? " on" : ""}`}
      onMouseEnter={(e) => {
        if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
        seguir(e);
        setAmpliada(true);
        setCargarGrande(true);
      }}
      onMouseMove={seguir}
      onMouseLeave={() => setAmpliada(false)}
    >
      <div className="pdp-zoom-inner" style={{ transformOrigin: origen }}>
        <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} priority={priority} />
        {cargarGrande && <Image src={src} alt="" fill sizes={sizesZoom} style={{ objectFit: "cover" }} />}
      </div>
    </div>
  );
}
