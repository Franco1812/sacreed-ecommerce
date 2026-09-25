"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarTextos } from "../../actions";
import CampoFoto from "./CampoFoto";
import type { CampoTexto, GrupoTexto } from "./campos";

function validar(campos: CampoTexto[], valores: Record<string, string>): string | null {
  for (const c of campos) {
    if (c.tipo === "numero" && !/^\d{1,9}$/.test((valores[c.clave] ?? "").trim())) {
      return `«${c.etiqueta}» tiene que ser un número entero, sin puntos ni signos.`;
    }
  }
  return null;
}

function Campo({ campo, valor, onCambio }: { campo: CampoTexto; valor: string; onCambio: (v: string) => void }) {
  const id = `campo-${campo.clave}`;
  const cambiado = campo.porDefecto !== "" && valor !== campo.porDefecto;

  return (
    <div className="admin-field">
      <label htmlFor={id}>{campo.etiqueta}</label>
      {campo.tipo === "texto" && <input id={id} value={valor} onChange={(e) => onCambio(e.target.value)} />}
      {campo.tipo === "largo" && <textarea id={id} rows={3} value={valor} onChange={(e) => onCambio(e.target.value)} />}
      {campo.tipo === "lista" && <textarea id={id} rows={5} value={valor} onChange={(e) => onCambio(e.target.value)} />}
      {campo.tipo === "numero" && (
        <input id={id} type="number" min={0} inputMode="numeric" value={valor} onChange={(e) => onCambio(e.target.value)} />
      )}
      {campo.ayuda && <span className="ce-hint">{campo.ayuda}</span>}
      {cambiado && (
        <button type="button" className="ce-restaurar" onClick={() => onCambio(campo.porDefecto)}>
          Volver al texto original
        </button>
      )}
    </div>
  );
}

/**
 * Editor genérico de los textos del sitio: arma una pestaña por grupo del registro de la API
 * (api/src/contenido/contenido.registro.ts), así que sumar un texto nuevo no requiere tocar el admin.
 */
export default function EditorTextos({ grupos, campos }: { grupos: GrupoTexto[]; campos: CampoTexto[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState(grupos[0]?.id ?? "");
  const editables = campos.filter((c) => c.tipo !== "imagen");
  const [valores, setValores] = useState<Record<string, string>>(() => Object.fromEntries(editables.map((c) => [c.clave, c.valor])));
  const [guardado, setGuardado] = useState<Record<string, string>>(valores);
  const [recienGuardado, setRecienGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiadas = editables.filter((c) => valores[c.clave] !== guardado[c.clave]);
  const sinGuardar = cambiadas.length > 0;
  const gruposConCambios = new Set(cambiadas.map((c) => c.grupo));

  // Avisa antes de cerrar la pestaña si hay cambios sin guardar.
  useEffect(() => {
    if (!sinGuardar) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sinGuardar]);

  function setValor(clave: string, valor: string) {
    setValores((v) => ({ ...v, [clave]: valor }));
    setError(null);
    setRecienGuardado(false);
  }

  function guardar() {
    const problema = validar(cambiadas, valores);
    if (problema) {
      setError(problema);
      return;
    }
    setError(null);
    const aEnviar = Object.fromEntries(cambiadas.map((c) => [c.clave, valores[c.clave]]));
    startTransition(async () => {
      const res = await guardarTextos(aEnviar);
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      setGuardado({ ...valores });
      setRecienGuardado(true);
      router.refresh();
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
      <div className="ce-tabs ce-tabs-wrap" role="tablist" aria-label="Secciones">
        {grupos.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={tab === g.id}
            aria-controls={`panel-${g.id}`}
            className="ce-tab"
            onClick={() => setTab(g.id)}
          >
            {g.titulo}
            {gruposConCambios.has(g.id) && <span className="ce-tab-punto" title="Tiene cambios sin guardar" aria-label="con cambios sin guardar"> ●</span>}
          </button>
        ))}
      </div>

      {/* Todos los paneles quedan montados (solo se oculta el que no se ve) para no perder lo escrito al cambiar de pestaña. */}
      {grupos.map((g) => (
        <div key={g.id} role="tabpanel" id={`panel-${g.id}`} aria-labelledby={`tab-${g.id}`} hidden={tab !== g.id}>
          <div className="ce-columna">
            <section className="ce-card">
              <h2>{g.titulo}</h2>
              <p className="ce-card-sub">{g.descripcion}</p>
              {campos
                .filter((c) => c.grupo === g.id)
                .map((c) =>
                  c.tipo === "imagen" ? (
                    <CampoFoto key={c.clave} campo={c} />
                  ) : (
                    <Campo key={c.clave} campo={c} valor={valores[c.clave] ?? ""} onCambio={(v) => setValor(c.clave, v)} />
                  )
                )}
            </section>
          </div>
        </div>
      ))}

      <div className="ce-savebar">
        <span className="ce-estado" data-tono={estado.tono} role="status" aria-live="polite">{estado.texto}</span>
        <a href="/" target="_blank" rel="noreferrer" className="ce-ver-sitio">Ver el sitio ↗</a>
        <button type="button" className="admin-btn" onClick={guardar} disabled={pending || !sinGuardar}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
