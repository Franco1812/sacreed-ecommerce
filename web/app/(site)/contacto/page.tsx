import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Contacto — SACRED Wellness Club" };

export default function ContactoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />

      <article className="content-page">
        <h1>Contacto</h1>
        <p>Escribinos a alguna de nuestras casillas con el dominio propio (§6.2 del brief):</p>
        <ul>
          <li>hola@[dominio]</li>
          <li>ventas@[dominio]</li>
          <li>contacto@[dominio]</li>
        </ul>
        <p className="pending-note">Dominio, canales adicionales (WhatsApp, Instagram @sacredwellness.club) y datos fiscales del pie de página están pendientes de definición por la marca.</p>
      </article>
    </>
  );
}
