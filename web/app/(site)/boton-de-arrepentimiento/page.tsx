"use client";

import Breadcrumbs from "@/components/Breadcrumbs";

export default function BotonArrepentimientoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Botón de arrepentimiento" }]} />

      <article className="content-page">
        <h1>Botón de arrepentimiento</h1>

        <p>
          Como consumidor tenés derecho a revocar tu compra dentro de los <strong>10 días corridos</strong> desde que la recibiste,
          sin necesidad de dar ningún motivo y sin que se te exija registro previo ni ningún trámite adicional. Este derecho está
          garantizado por la Ley 24.240 de Defensa del Consumidor.
        </p>

        <p className="pending-note">
          Marco normativo vigente citado en el brief: Disposición 954/2025 (unificó y derogó las resoluciones 316/2018 y
          424/2020), con la Disposición 3/2026 admitiendo medidas razonables de verificación de identidad. Conviene confirmar el
          texto legal vigente antes de publicar esta página en producción.
        </p>

        <h2>Cómo ejercer tu derecho de arrepentimiento</h2>
        <p>Completá el formulario con el número de tu pedido y contanos qué querés devolver. Te contactamos para coordinar la devolución.</p>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 14, maxWidth: 440, marginTop: 24 }}>
          <input type="text" placeholder="Número de pedido" style={{ padding: 12, border: "1px solid var(--hair)", background: "none", fontFamily: "var(--util)" }} />
          <input type="email" placeholder="tu@email.com" style={{ padding: 12, border: "1px solid var(--hair)", background: "none", fontFamily: "var(--util)" }} />
          <textarea placeholder="Contanos qué querés devolver" rows={4} style={{ padding: 12, border: "1px solid var(--hair)", background: "none", fontFamily: "var(--util)" }} />
          <button type="submit" className="btn btn-solid" style={{ justifySelf: "start" }}>Enviar solicitud</button>
        </form>
      </article>
    </>
  );
}
