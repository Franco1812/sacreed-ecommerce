"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { eliminarImagenHero, ordenarImagenesHero, subirImagenHero } from "../../actions";

export interface HeroFotoValue {
  id: string;
  url: string;
  alt: string;
}

export default function HeroFotos({ imagenes }: { imagenes: HeroFotoValue[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
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
    fd.set("alt", alt);
    correr(() => subirImagenHero(fd), "No se pudo subir la foto.", () => {
      setArchivo(null);
      setAlt("");
    });
  }

  function mover(indice: number, delta: -1 | 1) {
    const ids = imagenes.map((i) => i.id);
    const destino = indice + delta;
    [ids[indice], ids[destino]] = [ids[destino], ids[indice]];
    correr(() => ordenarImagenesHero(ids), "No se pudo cambiar el orden.");
  }

  return (
    <div className="admin-card">
      <div className="admin-block">
        <h2>Portada — fotos del carrusel</h2>
        <p className="admin-hint" style={{ marginBottom: 20 }}>
          Rotan solas, en este orden; la primera es la que se ve al entrar. Los cambios de esta sección se aplican al instante
          (no hace falta &quot;Guardar cambios&quot;). Dejá al menos una foto.
        </p>

        <div className="admin-gallery">
          {imagenes.map((img, i) => (
            <div className="admin-gallery-item" key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element -- galería de admin, no vale la pena next/image acá */}
              <img src={img.url} alt={img.alt} />
              <div className="admin-gallery-actions">
                <button type="button" onClick={() => mover(i, -1)} disabled={pending || i === 0} aria-label="Mover antes">←</button>
                <span>{i + 1}</span>
                <button type="button" onClick={() => mover(i, 1)} disabled={pending || i === imagenes.length - 1} aria-label="Mover después">→</button>
                <button
                  type="button"
                  className="admin-gallery-quitar"
                  onClick={() => correr(() => eliminarImagenHero(img.id), "No se pudo quitar la foto.")}
                  disabled={pending}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="hero-archivo">Foto nueva</label>
            <input id="hero-archivo" type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
          </div>
          <div className="admin-field">
            <label htmlFor="hero-alt">Descripción de la foto (para lectores de pantalla)</label>
            <input id="hero-alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <button type="button" className="admin-btn-ghost" onClick={subir} disabled={pending || !archivo}>
          {pending ? "Procesando…" : "Subir foto"}
        </button>
      </div>
    </div>
  );
}
