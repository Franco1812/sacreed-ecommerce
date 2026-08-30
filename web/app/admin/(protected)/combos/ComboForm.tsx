"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export interface ComboFormValues {
  slug: string;
  nombre: string;
  bajada: string;
  ritual: string[];
  porQueSePotencian: string;
  copyAprobado: boolean;
  precio: string;
  stock: string;
  productos: string[];
}

export interface ImagenValue {
  id: string;
  url: string;
  alt: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ComboForm({
  initial,
  modoEdicion,
  productosDisponibles,
  imagenes,
  onGuardar,
  onSubirImagen,
  onEliminarImagen,
}: {
  initial: ComboFormValues;
  modoEdicion: boolean;
  productosDisponibles: { slug: string; nombre: string }[];
  imagenes?: ImagenValue[];
  onGuardar: (data: ComboFormValues) => Promise<{ ok: boolean; error?: string; slug?: string }>;
  onSubirImagen?: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onEliminarImagen?: (imagenId: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [values, setValues] = useState(initial);
  const [slugTocado, setSlugTocado] = useState(modoEdicion);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const router = useRouter();

  function set<K extends keyof ComboFormValues>(key: K, value: ComboFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleNombreChange(nombre: string) {
    set("nombre", nombre);
    if (!slugTocado) set("slug", slugify(nombre));
  }

  function toggleRitual(modo: string) {
    set("ritual", values.ritual.includes(modo) ? values.ritual.filter((r) => r !== modo) : [...values.ritual, modo]);
  }

  function toggleProducto(slug: string) {
    set("productos", values.productos.includes(slug) ? values.productos.filter((s) => s !== slug) : [...values.productos, slug]);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await onGuardar(values);
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      router.push(`/admin/combos/${res.slug ?? values.slug}/editar`);
    });
  }

  function subirImagen() {
    if (!archivo || !onSubirImagen) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", archivo);
    fd.set("alt", alt);
    startTransition(async () => {
      const res = await onSubirImagen(fd);
      if (!res.ok) {
        setError(res.error ?? "No se pudo subir la imagen.");
        return;
      }
      setArchivo(null);
      setAlt("");
      router.refresh();
    });
  }

  function eliminarImagen(id: string) {
    if (!onEliminarImagen) return;
    startTransition(async () => {
      await onEliminarImagen(id);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      <div className="admin-block">
        <h2>Identidad</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Nombre</label>
            <input value={values.nombre} onChange={(e) => handleNombreChange(e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Slug {modoEdicion && "(no editable)"}</label>
            <input
              value={values.slug}
              disabled={modoEdicion}
              onChange={(e) => {
                setSlugTocado(true);
                set("slug", e.target.value);
              }}
            />
          </div>
        </div>
        <div className="admin-field">
          <label>Bajada</label>
          <input value={values.bajada} onChange={(e) => set("bajada", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Ritual</label>
          <div className="admin-checkbox-row">
            <label><input type="checkbox" checked={values.ritual.includes("am")} onChange={() => toggleRitual("am")} /> AM</label>
            <label><input type="checkbox" checked={values.ritual.includes("pm")} onChange={() => toggleRitual("pm")} /> PM</label>
          </div>
        </div>
      </div>

      <div className="admin-block">
        <h2>Copy</h2>
        <div className="admin-field">
          <label>Por qué se potencian</label>
          <textarea value={values.porQueSePotencian} onChange={(e) => set("porQueSePotencian", e.target.value)} />
        </div>
        <div className="admin-checkbox-row">
          <label>
            <input type="checkbox" checked={values.copyAprobado} onChange={(e) => set("copyAprobado", e.target.checked)} />
            {" "}Copy aprobado por la marca
          </label>
        </div>
      </div>

      <div className="admin-block">
        <h2>Precio y stock</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Precio</label>
            <input type="number" value={values.precio} onChange={(e) => set("precio", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Stock</label>
            <input type="number" value={values.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-block">
        <h2>Productos que lo integran</h2>
        <div className="admin-checkbox-row" style={{ flexWrap: "wrap", rowGap: 10 }}>
          {productosDisponibles.map((p) => (
            <label key={p.slug}>
              <input type="checkbox" checked={values.productos.includes(p.slug)} onChange={() => toggleProducto(p.slug)} /> {p.nombre}
            </label>
          ))}
        </div>
      </div>

      {modoEdicion && (
        <div className="admin-block">
          <h2>Fotos</h2>
          <div className="admin-gallery">
            {imagenes?.map((img) => (
              <div className="admin-gallery-item" key={img.id}>
                {/* eslint-disable-next-line @next/next/no-img-element -- galería de admin, no vale la pena next/image acá */}
                <img src={img.url} alt={img.alt} />
                <button type="button" onClick={() => eliminarImagen(img.id)} disabled={pending}>Quitar</button>
              </div>
            ))}
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Archivo</label>
              <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
            </div>
            <div className="admin-field">
              <label>Alt (descripción de la foto)</label>
              <input value={alt} onChange={(e) => setAlt(e.target.value)} />
            </div>
          </div>
          <button type="button" className="admin-btn-ghost" onClick={subirImagen} disabled={pending || !archivo}>Subir foto</button>
        </div>
      )}

      {error && <p className="admin-error">{error}</p>}
      <button type="button" className="admin-btn" onClick={submit} disabled={pending}>
        {modoEdicion ? "Guardar cambios" : "Crear combo"}
      </button>
    </div>
  );
}
