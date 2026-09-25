"use client";

export default function FormularioArrepentimiento() {
  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 14, maxWidth: 440, marginTop: 24 }}>
      <input type="text" placeholder="Número de pedido" style={{ padding: 12, border: "1px solid var(--hair)", background: "none", fontFamily: "var(--util)" }} />
      <input type="email" placeholder="tu@email.com" style={{ padding: 12, border: "1px solid var(--hair)", background: "none", fontFamily: "var(--util)" }} />
      <textarea placeholder="Contanos qué querés devolver" rows={4} style={{ padding: 12, border: "1px solid var(--hair)", background: "none", fontFamily: "var(--util)" }} />
      <button type="submit" className="btn btn-solid" style={{ justifySelf: "start" }}>Enviar solicitud</button>
    </form>
  );
}
