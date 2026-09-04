"use client";

import Link from "next/link";
import type { Linea } from "@/lib/types";

export default function Footer({ lineas }: { lineas: Linea[] }) {
  return (
    <>
      <div className="news anchor">
        <div className="wrap">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>Una carta cada quince días</span>
          <h2>Sumate al Club de la Pausa Consciente</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="tu@email.com" aria-label="Email" />
            <button type="submit">Suscribirme</button>
          </form>
          <small>Sin spam. Te podés dar de baja cuando quieras.</small>
        </div>
      </div>

      <footer>
        <div className="wrap foot-grid">
          <div>
            <span className="wordmark" style={{ color: "var(--brush)" }}>Sacred</span>
            <p className="tag">Tu cuerpo cambia cuando cambia tu alacena.</p>
          </div>
          <div>
            <h5>Comprar</h5>
            <ul>
              {lineas.map((l) => (
                <li key={l.slug}><Link href={`/comprar-por-beneficio/${l.slug}`}>{l.nombre}</Link></li>
              ))}
              <li><Link href="/rituales">Rituales AM / PM</Link></li>
              <li><Link href="/combos">Combos Sinérgicos</Link></li>
            </ul>
          </div>
          <div>
            <h5>Marca</h5>
            <ul>
              <li><Link href="/nuestro-origen">Nuestro Origen</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
              <li><Link href="/preguntas-frecuentes">Preguntas frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h5>Ayuda</h5>
            <ul>
              <li><Link href="/envios">Envíos y entregas</Link></li>
              <li><Link href="/cambios-y-devoluciones">Cambios y devoluciones</Link></li>
              <li><Link href="/terminos-y-condiciones">Términos y condiciones</Link></li>
              <li><Link href="/politica-de-privacidad">Política de privacidad</Link></li>
              <li><Link href="/boton-de-arrepentimiento"><strong>Botón de arrepentimiento</strong></Link></li>
            </ul>
          </div>
        </div>
        <div className="wrap foot-bottom">
          <span>© 2026 SACRED Wellness Club</span>
          <span>Términos · Privacidad · Botón de arrepentimiento · Defensa al consumidor</span>
        </div>
        <p className="legal">Los productos comercializados son alimentos y suplementos dietarios. No son medicamentos y no reemplazan una alimentación variada ni el consejo de un profesional de la salud. Ante cualquier duda, consultá con tu médico o nutricionista.</p>
      </footer>
    </>
  );
}
