"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="news anchor">
        <div className="wrap">
          <h2>Sumate al Club de la Pausa Consciente</h2>
        </div>
      </div>

      <footer>
        <div className="wrap foot-grid">
          <div>
            <Image src="/logo-badge-v3.png" alt="SACRED Wellness Club" width={480} height={463} className="brand-badge foot-badge" />
            <p className="tag">Tu cuerpo cambia cuando cambia tu alacena.</p>
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
