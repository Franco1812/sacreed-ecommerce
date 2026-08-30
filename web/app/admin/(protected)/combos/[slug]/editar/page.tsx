import { notFound } from "next/navigation";
import { ComboForm, type ComboFormValues } from "../../ComboForm";
import { actualizarComboCompleto, eliminarImagenCombo, subirImagenCombo } from "../../../../actions";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface ImagenDb {
  id: string;
  url: string;
  alt: string;
}

interface ProductoResumen {
  slug: string;
  nombre: string;
}

interface ComboDb {
  slug: string;
  nombre: string;
  bajada: string;
  ritual: string[];
  porQueSePotencian: string;
  copyAprobado: boolean;
  precio: number;
  stock: number;
  productos: { producto: ProductoResumen }[];
  imagenes: ImagenDb[];
}

async function getProductosDisponibles(): Promise<ProductoResumen[]> {
  const res = await fetch(`${API_URL}/productos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /productos: ${res.status}`);
  return res.json();
}

async function getCombo(slug: string): Promise<ComboDb | null> {
  const res = await fetch(`${API_URL}/combos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /combos: ${res.status}`);
  const rows: ComboDb[] = await res.json();
  return rows.find((c) => c.slug === slug) ?? null;
}

function toFormValues(c: ComboDb): ComboFormValues {
  return {
    slug: c.slug,
    nombre: c.nombre,
    bajada: c.bajada,
    ritual: c.ritual.map((r) => r.toLowerCase()),
    porQueSePotencian: c.porQueSePotencian,
    copyAprobado: c.copyAprobado,
    precio: String(c.precio),
    stock: String(c.stock),
    productos: c.productos.map((cp) => cp.producto.slug),
  };
}

export default async function EditarComboPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [combo, productosDisponibles] = await Promise.all([getCombo(slug), getProductosDisponibles()]);
  if (!combo) notFound();

  return (
    <>
      <div className="admin-main-head">
        <h1>{combo.nombre}</h1>
      </div>
      <ComboForm
        initial={toFormValues(combo)}
        modoEdicion
        productosDisponibles={productosDisponibles}
        imagenes={combo.imagenes}
        onGuardar={actualizarComboCompleto.bind(null, slug)}
        onSubirImagen={subirImagenCombo.bind(null, slug)}
        onEliminarImagen={eliminarImagenCombo.bind(null, slug)}
      />
    </>
  );
}
