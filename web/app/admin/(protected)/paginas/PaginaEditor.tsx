"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Prosa from "@/components/Prosa";
import { guardarPagina, restaurarPagina } from "../../actions";

const VARIANTES: Record<string, "institucional" | "faq"> = {
  "nuestro-origen": "institucional",
  "preguntas-frecuentes": "faq",
};

export default function PaginaEditor({
  slug,
  ruta,
  titulo: tituloInicial,
  cuerpo: cuerpoInicial,
  editada,
}: {
  slug: string;
  ruta: string;
  titulo: string;
  cuerpo: string;
  editada: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [titulo, setTitulo] = useState(tituloInicial);
  const [cuerpo, setCuerpo] = useState(cuerpoInicial);
  const [guardado, setGuardado] = useState({ titulo: tituloInicial, cuerpo: cuerpoInicial });
  const [confirmarRestaurar, setConfirmarRestaurar] = useState(false);
  const [recienGuardado, setRecienGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sinGuardar = titulo !== guardado.titulo || cuerpo !== guardado.cuerpo;

  useEffect(() => {
    if (!sinGuardar) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sinGuardar]);

  function guardar() {
    if (!titulo.trim()) {
      setError("La página necesita un título.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await guardarPagina(slug, { titulo, cuerpo });
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      setGuardado({ titulo, cuerpo });
      setRecienGuardado(true);
      router.refresh();
    });
  }

  function restaurar() {
    setError(null);
    startTransition(async () => {
      const res = await restaurarPagina(slug);
      if (!res.ok) {
        setError(res.error ?? "No se pudo restaurar.");
        return;
      }
      setConfirmarRestaurar(false);
      // El texto original viene de la API: se recarga la página para tomarlo.
      window.location.reload();
    });
  }

  let estado: { texto: string; tono: "info" | "aviso" | "ok" | "error" };
  if (pending) estado = { texto: "Guardando…", tono: "info" };
  else if (error) estado = { texto: error, tono: "error" };
  else if (sinGuardar) estado = { texto: "Tenés cambios sin guardar", tono: "aviso" };
  else if (recienGuardado) estado = { texto: "✓ Guardado. Ya se ve en el sitio.", tono: "ok" };
  else estado = { texto: "Todo guardado", tono: "info" };

  return (
    <div>
      <div className="ce-layout">
        <div>
          <section className="ce-card">
            <h2>Texto de la página</h2>
            <div className="admin-field">
              <label htmlFor="pagina-titulo">Título</label>
              <input id="pagina-titulo" value={titulo} onChange={(e) => { setTitulo(e.target.value); setRecienGuardado(false); }} />
            </div>
            <div className="admin-field">
              <label htmlFor="pagina-cuerpo">Texto</label>
              <textarea
                id="pagina-cuerpo"
                className="ce-cuerpo"
                rows={20}
                value={cuerpo}
                onChange={(e) => { setCuerpo(e.target.value); setRecienGuardado(false); }}
              />
              <span className="ce-hint">Dejá un renglón en blanco entre un párrafo y otro.</span>
            </div>

            <details className="ce-ayuda">
              <summary>Cómo dar formato al texto</summary>
              <ul>
                <li><code>## Un subtítulo</code> — arma un subtítulo.</li>
                <li><code>### Una pregunta</code> — en preguntas frecuentes, arma cada pregunta; lo que sigue es la respuesta.</li>
                <li><code>- Un punto</code> — arma una lista (un renglón por punto).</li>
                <li><code>&gt; Una cita</code> — destaca una frase.</li>
                <li><code>**negrita**</code> y <code>==resaltado==</code> — resaltan una parte del texto.</li>
                <li><code>[texto del link](/comprar-por-beneficio)</code> — arma un link a otra página del sitio o a una web (<code>https://…</code>).</li>
                <li><code>{"{envioGratis}"}</code> — se reemplaza solo por el monto de envío gratis que cargaste en «Envíos y pagos».</li>
              </ul>
            </details>

            {editada && (
              <div className="ce-restaurar-bloque">
                {confirmarRestaurar ? (
                  <>
                    <span>Vas a perder lo que escribiste y la página vuelve al texto con el que venía el sitio.</span>
                    <button type="button" className="admin-btn-ghost" onClick={restaurar} disabled={pending}>Sí, volver al original</button>
                    <button type="button" className="ce-restaurar" onClick={() => setConfirmarRestaurar(false)}>Cancelar</button>
                  </>
                ) : (
                  <button type="button" className="ce-restaurar" onClick={() => setConfirmarRestaurar(true)}>Volver al texto original de esta página</button>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="ce-preview" aria-label="Vista previa de la página">
          <div className="ce-preview-label">
            <strong>Así se ve</strong>
            <span>Se actualiza mientras escribís</span>
          </div>
          <div className="ce-pagina-preview">
            {slug !== "nuestro-origen" && <h3>{titulo}</h3>}
            <Prosa texto={cuerpo} variante={VARIANTES[slug]} />
          </div>
        </aside>
      </div>

      <div className="ce-savebar">
        <span className="ce-estado" data-tono={estado.tono} role="status" aria-live="polite">{estado.texto}</span>
        <a href={ruta} target="_blank" rel="noreferrer" className="ce-ver-sitio">Ver en el sitio ↗</a>
        <button type="button" className="admin-btn" onClick={guardar} disabled={pending || !sinGuardar}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
