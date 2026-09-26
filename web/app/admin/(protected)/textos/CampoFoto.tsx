"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { quitarImagenTexto, subirImagenTexto } from "../../actions";
import type { CampoTexto } from "./campos";

/** Foto de un campo del sitio (pilares, banner). A diferencia de los textos, se sube y se quita al instante. */
export default function CampoFoto({ campo }: { campo: CampoTexto }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function correr(accion: () => Promise<{ ok: boolean; error?: string }>, mensajeError: string, alTerminar?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await accion();
      if (!res.ok) {
        setError(res.error ?? mensajeError);
        return;
      }
      alTerminar?.();
      router.refresh();
    });
  }

  function subir() {
    if (!archivo) return;
    const fd = new FormData();
    fd.set("file", archivo);
    correr(() => subirImagenTexto(campo.clave, fd), "No se pudo subir la foto.", () => setArchivo(null));
  }

  return (
    <div className="admin-field ce-campo-foto">
      <label htmlFor={`foto-${campo.clave}`}>{campo.etiqueta}</label>
      <div className="ce-campo-foto-fila">
        <div className="ce-campo-foto-img">
          {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de admin */}
          {campo.valor ? <img src={campo.valor} alt="" /> : <span>Sin foto</span>}
        </div>
        <div className="ce-campo-foto-acciones">
          <input id={`foto-${campo.clave}`} type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
          <div className="ce-campo-foto-botones">
            <button type="button" className="admin-btn-ghost" onClick={subir} disabled={pending || !archivo}>
              {pending ? "Procesando…" : campo.valor ? "Cambiar foto" : "Subir foto"}
            </button>
            {campo.valor && (
              <button type="button" className="ce-foto-quitar" onClick={() => correr(() => quitarImagenTexto(campo.clave), "No se pudo quitar la foto.")} disabled={pending}>
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>
      {campo.ayuda && <span className="ce-hint">{campo.ayuda}</span>}
      {error && <p className="admin-error" role="alert">{error}</p>}
    </div>
  );
}
