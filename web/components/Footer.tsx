"use client";

import Image from "next/image";
import Link from "next/link";
import type { Textos } from "@/lib/textos";
import type { Linea } from "@/lib/types";

export default function Footer({ lineas, textos: t }: { lineas: Linea[]; textos: Textos }) {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-news">
          <Image src="/logo-badge-v3.png" alt="SACRED Wellness Club" width={480} height={463} className="brand-badge foot-badge" />
          <h2>{t["pie.titulo"]}</h2>
          <p className="foot-news-lede">{t["pie.bajada"]}</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="tu@email.com" aria-label="Email" />
            <button type="submit" className="btn btn-solid">{t["pie.boton"]}</button>
          </form>
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
      <div className="wrap">
        {t["pie.legal"] && <p className="legal">{t["pie.legal"]}</p>}
        <div className="foot-bottom">
          <span>{t["pie.copyright"]}</span>
          <span>{t["pie.linea"]}</span>
        </div>
      </div>
    </footer>
  );
}
