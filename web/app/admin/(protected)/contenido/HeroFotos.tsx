"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { eliminarImagenHero, ordenarImagenesHero, subirImagenHero } from "../../actions";
import type { HeroFotoValue } from "./campos";

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
    <section className="ce-card">
      <div className="ce-card-head">
        <h2>Fotos del carrusel</h2>
        <span className="ce-tag">Se aplican al instante</span>
      </div>
      <p className="ce-card-sub">
        Rotan solas en la portada, en este orden. La primera es la que se ve al entrar. Dejá al menos una.
      </p>

      <div className="ce-fotos">
        {imagenes.map((img, i) => (
          <figure className="ce-foto" key={img.id}>
            <div className="ce-foto-img">
              {/* eslint-disable-next-line @next/next/no-img-element -- galería de admin, no vale la pena next/image acá */}
              <img src={img.url} alt={img.alt} />
              {i === 0 && <span className="ce-foto-badge">Primera</span>}
            </div>
            <div className="ce-foto-actions">
              <button type="button" onClick={() => mover(i, -1)} disabled={pending || i === 0} aria-label={`Mover la foto ${i + 1} antes`} title="Mover antes">←</button>
              <span>{i + 1}</span>
              <button type="button" onClick={() => mover(i, 1)} disabled={pending || i === imagenes.length - 1} aria-label={`Mover la foto ${i + 1} después`} title="Mover después">→</button>
              <button
                type="button"
                className="ce-foto-quitar"
                onClick={() => correr(() => eliminarImagenHero(img.id), "No se pudo quitar la foto.")}
                disabled={pending}
              >
                Quitar
              </button>
            </div>
          </figure>
        ))}
      </div>

      <div className="ce-subir">
        <h3>Agregar una foto</h3>
        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="hero-archivo">Archivo</label>
            <input id="hero-archivo" type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
          </div>
          <div className="admin-field">
            <label htmlFor="hero-alt">Qué se ve en la foto</label>
            <input id="hero-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Ej: Taza de matcha sobre una mesa de madera" />
            <span className="ce-hint">Es para personas que usan lector de pantalla y para Google.</span>
          </div>
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button type="button" className="admin-btn-ghost" onClick={subir} disabled={pending || !archivo}>
          {pending ? "Procesando…" : "Subir foto"}
        </button>
      </div>
    </section>
  );
}
