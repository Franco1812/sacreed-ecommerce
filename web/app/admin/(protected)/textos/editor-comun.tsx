"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatPrecio } from "@/lib/format";
import CampoFoto from "./CampoFoto";
import type { CampoTexto, GrupoTexto } from "./campos";

/** Lo que reciben las vistas previas: el texto de cada clave tal como se va a ver en el sitio. */
export interface CtxPrevia {
  /** Valor actual (con lo que se está escribiendo) y con {envioGratis}/{costoEnvio} ya reemplazados. */
  v: (clave: string) => string;
  ajustes: { envioGratis: number; costoEnvio: number };
  /** Nombres de las líneas de beneficio (el pie las lista en «Comprar»). */
  lineas?: string[];
}

/**
 * Estado de los textos del registro que se editan en una pantalla: qué cambió respecto de lo
 * guardado y cómo se leen para la vista previa. `base` son los valores de todos los campos, para
 * resolver lo que no se edita acá (ej. el monto de envío gratis en la ficha de producto).
 */
export function useTextosEditables(campos: CampoTexto[], base: Record<string, string>) {
  const editables = campos.filter((c) => c.tipo !== "imagen");
  const [valores, setValores] = useState<Record<string, string>>(() => Object.fromEntries(editables.map((c) => [c.clave, c.valor])));
  const [guardado, setGuardado] = useState<Record<string, string>>(valores);

  const cambiadas = editables.filter((c) => valores[c.clave] !== guardado[c.clave]);
  // Las fotos se suben al instante: su valor vigente viene siempre en `campos` (se refresca tras subir).
  const fotos = Object.fromEntries(campos.filter((c) => c.tipo === "imagen").map((c) => [c.clave, c.valor]));
  const crudo = (clave: string) => valores[clave] ?? fotos[clave] ?? base[clave] ?? "";
  const ajustes = { envioGratis: Number(crudo("envio.gratisDesde")) || 0, costoEnvio: Number(crudo("envio.costoZona")) || 0 };
  const v = (clave: string) =>
    crudo(clave).replaceAll("{envioGratis}", formatPrecio(ajustes.envioGratis)).replaceAll("{costoEnvio}", formatPrecio(ajustes.costoEnvio));

  return {
    valores,
    cambiadas,
    ctx: { v, ajustes } satisfies CtxPrevia,
    setValor: (clave: string, valor: string) => setValores((vs) => ({ ...vs, [clave]: valor })),
    /** Solo lo que cambió, listo para `guardarTextos`. */
    aGuardar: () => Object.fromEntries(cambiadas.map((c) => [c.clave, valores[c.clave]])),
    marcarGuardado: () => setGuardado({ ...valores }),
  };
}

export function validarTextos(campos: CampoTexto[], valores: Record<string, string>): string | null {
  for (const c of campos) {
    if (c.tipo === "numero" && !/^\d{1,9}$/.test((valores[c.clave] ?? "").trim())) {
      return `«${c.etiqueta}» tiene que ser un número entero, sin puntos ni signos.`;
    }
  }
  return null;
}

/** Avisa antes de cerrar la pestaña si hay cambios sin guardar. */
export function useAvisoSinGuardar(sinGuardar: boolean) {
  useEffect(() => {
    if (!sinGuardar) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sinGuardar]);
}

export function Campo({ campo, valor, onCambio }: { campo: CampoTexto; valor: string; onCambio: (v: string) => void }) {
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

export function VistaPrevia({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <aside className="ce-preview" aria-label={`Vista previa: ${titulo}`}>
      <div className="ce-preview-label">
        <strong>{titulo}</strong>
        <span>Se actualiza mientras escribís</span>
      </div>
      {children}
    </aside>
  );
}

/** Tarjeta con los campos de un grupo del registro, con su vista previa al costado si la tiene. */
export function PanelGrupo({
  grupo,
  campos,
  valores,
  onCambio,
  previa,
}: {
  grupo: GrupoTexto;
  campos: CampoTexto[];
  valores: Record<string, string>;
  onCambio: (clave: string, valor: string) => void;
  previa?: { titulo: string; contenido: ReactNode };
}) {
  const tarjeta = (
    <section className="ce-card">
      <h2>{grupo.titulo}</h2>
      <p className="ce-card-sub">{grupo.descripcion}</p>
      {campos
        .filter((c) => c.grupo === grupo.id)
        .map((c) =>
          c.tipo === "imagen" ? (
            <CampoFoto key={c.clave} campo={c} />
          ) : (
            <Campo key={c.clave} campo={c} valor={valores[c.clave] ?? ""} onCambio={(v) => onCambio(c.clave, v)} />
          )
        )}
    </section>
  );

  if (!previa) return <div className="ce-columna">{tarjeta}</div>;
  return (
    <div className="ce-layout">
      <div>{tarjeta}</div>
      <VistaPrevia titulo={previa.titulo}>{previa.contenido}</VistaPrevia>
    </div>
  );
}

export type Tono = "info" | "aviso" | "ok" | "error";

export function estadoGuardado({
  pending,
  error,
  sinGuardar,
  recienGuardado,
}: {
  pending: boolean;
  error: string | null;
  sinGuardar: boolean;
  recienGuardado: boolean;
}): { texto: string; tono: Tono } {
  if (pending) return { texto: "Guardando…", tono: "info" };
  if (error) return { texto: error, tono: "error" };
  if (sinGuardar) return { texto: "Tenés cambios sin guardar", tono: "aviso" };
  if (recienGuardado) return { texto: "✓ Guardado. Ya se ve en el sitio.", tono: "ok" };
  return { texto: "Todo guardado", tono: "info" };
}

export function BarraGuardar({
  estado,
  pending,
  sinGuardar,
  onGuardar,
  verHref = "/",
}: {
  estado: { texto: string; tono: Tono };
  pending: boolean;
  sinGuardar: boolean;
  onGuardar: () => void;
  verHref?: string;
}) {
  return (
    <div className="ce-savebar">
      <span className="ce-estado" data-tono={estado.tono} role="status" aria-live="polite">{estado.texto}</span>
      <a href={verHref} target="_blank" rel="noreferrer" className="ce-ver-sitio">Ver el sitio ↗</a>
      <button type="button" className="admin-btn" onClick={onGuardar} disabled={pending || !sinGuardar}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}

/** Pestañas; todos los paneles quedan montados (solo se oculta el que no se ve) para no perder lo escrito al cambiar. */
export function Pestanas({
  pestanas,
  activa,
  onCambio,
}: {
  pestanas: { id: string; titulo: string; conCambios?: boolean }[];
  activa: string;
  onCambio: (id: string) => void;
}) {
  return (
    <div className="ce-tabs ce-tabs-wrap" role="tablist" aria-label="Secciones">
      {pestanas.map((p) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          id={`tab-${p.id}`}
          aria-selected={activa === p.id}
          aria-controls={`panel-${p.id}`}
          className="ce-tab"
          onClick={() => onCambio(p.id)}
        >
          {p.titulo}
          {p.conCambios && <span className="ce-tab-punto" title="Tiene cambios sin guardar" aria-label="con cambios sin guardar"> ●</span>}
        </button>
      ))}
    </div>
  );
}

export function Panel({ id, activa, children }: { id: string; activa: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} hidden={activa !== id}>
      {children}
    </div>
  );
}
