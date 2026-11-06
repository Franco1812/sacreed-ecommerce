"use client";

import { useState, useTransition } from "react";
import { eliminarCombo } from "../../actions";

/** Botón "Eliminar" de cada fila de Admin → Combos, con confirmación en la misma fila. */
export default function EliminarComboBoton({ slug, nombre }: { slug: string; nombre: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function eliminar() {
    setError(null);
    startTransition(async () => {
      const res = await eliminarCombo(slug);
      if (!res.ok) {
        setError(res.error ?? "No se pudo eliminar.");
        setConfirmando(false);
      }
    });
  }

  if (confirmando) {
    return (
      <div className="pf-eliminar-confirmar">
        <span>¿Eliminar «{nombre}»?</span>
        <button type="button" className="admin-btn pf-eliminar-si" onClick={eliminar} disabled={pending}>
          {pending ? "Eliminando…" : "Sí, eliminar"}
        </button>
        <button type="button" className="admin-btn-ghost" onClick={() => setConfirmando(false)} disabled={pending}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="admin-btn-ghost pf-eliminar-btn"
        onClick={() => {
          setError(null);
          setConfirmando(true);
        }}
      >
        Eliminar
      </button>
      {error && <p className="pf-eliminar-error" role="alert">{error}</p>}
    </>
  );
}
