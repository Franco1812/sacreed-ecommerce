"use client";

import Link from "next/link";
import { useState } from "react";
import type { Producto, RitualModo } from "@/lib/types";

export default function RitualToggle({
  am,
  pm,
}: {
  am: Producto[];
  pm: Producto[];
}) {
  const [modo, setModo] = useState<RitualModo>("am");
  const productos = modo === "am" ? am : pm;

  return (
    <section id="ritual" className={`ritual anchor ${modo === "pm" ? "is-pm" : ""}`}>
      <div className="wrap">
        <div className="ritual-top">
          <span className="eyebrow">El día tiene dos mitades</span>
          <h2>Elegí tu ritual</h2>
          <p className="ritual-lede">Diseñada para acompañar la curva biológica del día: desde el encendido consciente de la mañana hasta el descanso restaurador de la noche.</p>
          <div className="toggle" role="group" aria-label="Elegir momento del día">
            <span className="thumb" aria-hidden="true"></span>
            <button type="button" aria-pressed={modo === "am"} onClick={() => setModo("am")}>☀ Mañana</button>
            <button type="button" aria-pressed={modo === "pm"} onClick={() => setModo("pm")}>☾ Noche</button>
          </div>
        </div>

        <div className="ritual-panel on">
          <div className="ritual-steps">
            {productos.map((p) => (
              <article className="step" key={p.slug}>
                <span className="step-hour">{p.momentoSugerido}</span>
                <h4><Link href={`/producto/${p.slug}`}>{p.nombre}</Link></h4>
                <p>{p.descripcion.slice(0, 110)}…</p>
                <div className="step-media"><span className="ph">Foto ritual {modo.toUpperCase()}</span></div>
              </article>
            ))}
          </div>
          <div className="ritual-cta">
            <Link href={`/rituales/${modo}`} className="btn btn-solid">Comprar el ritual {modo.toUpperCase()} completo</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
