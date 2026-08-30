"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export interface FormulaItem {
  ingrediente: string;
  texto: string;
}

export interface ProductoFormValues {
  slug: string;
  nombre: string;
  formulaSubtitulo: string;
  linea: string;
  ritual: string[];
  orden: string;
  momentoSugerido: string;
  descripcion: string;
  laFormula: FormulaItem[];
  beneficios: string[];
  ritualDeUso: string;
  ingredientes: string;
  notaDePureza: string;
  origen: string;
  precio: string;
  formato: string;
  pesoNetoGramos: string;
  paqueteAltoCm: string;
  paqueteAnchoCm: string;
  paqueteProfundidadCm: string;
  stock: string;
  destacado: string;
  nombrePendiente: boolean;
  seoTitulo: string;
  seoDescripcion: string;
}

export interface ImagenValue {
  id: string;
  url: string;
  alt: string;
}

const LINEAS = [
  { value: "FOCO_VITALIDAD", label: "Foco & Vitalidad" },
  { value: "LONGEVIDAD_GLOW", label: "Longevidad & Glow" },
  { value: "SALUD_INTESTINAL", label: "Salud Intestinal" },
  { value: "CALMA_ALQUIMICA", label: "Calma Alquímica" },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductoForm({
  initial,
  modoEdicion,
  imagenes,
  onGuardar,
  onSubirImagen,
  onEliminarImagen,
}: {
  initial: ProductoFormValues;
  modoEdicion: boolean;
  imagenes?: ImagenValue[];
  onGuardar: (data: ProductoFormValues) => Promise<{ ok: boolean; error?: string; slug?: string }>;
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

  function set<K extends keyof ProductoFormValues>(key: K, value: ProductoFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleNombreChange(nombre: string) {
    set("nombre", nombre);
    if (!slugTocado) set("slug", slugify(nombre));
  }

  function toggleRitual(modo: string) {
    set("ritual", values.ritual.includes(modo) ? values.ritual.filter((r) => r !== modo) : [...values.ritual, modo]);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await onGuardar(values);
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      router.push(`/admin/productos/${res.slug ?? values.slug}/editar`);
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
            <label>Subtítulo de fórmula (opcional)</label>
            <input value={values.formulaSubtitulo} onChange={(e) => set("formulaSubtitulo", e.target.value)} />
          </div>
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

      <div className="admin-block">
        <h2>Categoría</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Línea</label>
            <select value={values.linea} onChange={(e) => set("linea", e.target.value)}>
              <option value="">Elegir...</option>
              {LINEAS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label>Orden dentro de rituales</label>
            <input type="number" value={values.orden} onChange={(e) => set("orden", e.target.value)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Ritual</label>
          <div className="admin-checkbox-row">
            <label><input type="checkbox" checked={values.ritual.includes("am")} onChange={() => toggleRitual("am")} /> AM</label>
            <label><input type="checkbox" checked={values.ritual.includes("pm")} onChange={() => toggleRitual("pm")} /> PM</label>
          </div>
        </div>
        <div className="admin-field">
          <label>Momento sugerido (opcional)</label>
          <input value={values.momentoSugerido} onChange={(e) => set("momentoSugerido", e.target.value)} />
        </div>
      </div>

      <div className="admin-block">
        <h2>Ficha</h2>
        <div className="admin-field">
          <label>Descripción</label>
          <textarea value={values.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Ritual de uso</label>
          <textarea value={values.ritualDeUso} onChange={(e) => set("ritualDeUso", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Ingredientes (opcional)</label>
          <textarea value={values.ingredientes} onChange={(e) => set("ingredientes", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Nota de pureza (opcional)</label>
          <textarea value={values.notaDePureza} onChange={(e) => set("notaDePureza", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Origen (opcional)</label>
          <input value={values.origen} onChange={(e) => set("origen", e.target.value)} />
        </div>
      </div>

      <div className="admin-block">
        <h2>Beneficios</h2>
        {values.beneficios.map((b, i) => (
          <div className="admin-repeater-item" key={i}>
            <div>
              <input value={b} onChange={(e) => set("beneficios", values.beneficios.map((x, idx) => (idx === i ? e.target.value : x)))} />
            </div>
            <button type="button" className="admin-remove-line" onClick={() => set("beneficios", values.beneficios.filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
        <button type="button" className="admin-add-line" onClick={() => set("beneficios", [...values.beneficios, ""])}>+ Agregar beneficio</button>
      </div>

      <div className="admin-block">
        <h2>La fórmula (opcional)</h2>
        {values.laFormula.map((item, i) => (
          <div className="admin-repeater-item" key={i}>
            <div>
              <input
                placeholder="Ingrediente"
                value={item.ingrediente}
                onChange={(e) => set("laFormula", values.laFormula.map((x, idx) => (idx === i ? { ...x, ingrediente: e.target.value } : x)))}
              />
              <textarea
                placeholder="Texto"
                value={item.texto}
                onChange={(e) => set("laFormula", values.laFormula.map((x, idx) => (idx === i ? { ...x, texto: e.target.value } : x)))}
              />
            </div>
            <button type="button" className="admin-remove-line" onClick={() => set("laFormula", values.laFormula.filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
        <button type="button" className="admin-add-line" onClick={() => set("laFormula", [...values.laFormula, { ingrediente: "", texto: "" }])}>+ Agregar ingrediente</button>
      </div>

      <div className="admin-block">
        <h2>Precio, stock y formato</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Precio</label>
            <input type="number" value={values.precio} onChange={(e) => set("precio", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Stock</label>
            <input type="number" value={values.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Formato (opcional)</label>
            <input value={values.formato} onChange={(e) => set("formato", e.target.value)} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Peso neto en gramos (opcional)</label>
            <input type="number" value={values.pesoNetoGramos} onChange={(e) => set("pesoNetoGramos", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Paquete alto cm (opcional)</label>
            <input type="number" value={values.paqueteAltoCm} onChange={(e) => set("paqueteAltoCm", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Paquete ancho cm (opcional)</label>
            <input type="number" value={values.paqueteAnchoCm} onChange={(e) => set("paqueteAnchoCm", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Paquete profundidad cm (opcional)</label>
            <input type="number" value={values.paqueteProfundidadCm} onChange={(e) => set("paqueteProfundidadCm", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-block">
        <h2>Extras</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Destacado (opcional, ej. &quot;Más vendido&quot;)</label>
            <input value={values.destacado} onChange={(e) => set("destacado", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>SEO título (opcional)</label>
            <input value={values.seoTitulo} onChange={(e) => set("seoTitulo", e.target.value)} />
          </div>
        </div>
        <div className="admin-field">
          <label>SEO descripción (opcional)</label>
          <input value={values.seoDescripcion} onChange={(e) => set("seoDescripcion", e.target.value)} />
        </div>
        <div className="admin-checkbox-row">
          <label>
            <input type="checkbox" checked={values.nombrePendiente} onChange={(e) => set("nombrePendiente", e.target.checked)} />
            {" "}Nombre todavía pendiente de definir por la marca
          </label>
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
        {modoEdicion ? "Guardar cambios" : "Crear producto"}
      </button>
    </div>
  );
}
