import { notFound } from "next/navigation";
import { ProductoForm, type FormulaItem, type ProductoFormValues } from "../../ProductoForm";
import { actualizarProductoCompleto, eliminarImagenProducto, subirImagenProducto } from "../../../../actions";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface ImagenDb {
  id: string;
  url: string;
  alt: string;
}

interface ProductoDb {
  slug: string;
  nombre: string;
  formulaSubtitulo: string | null;
  linea: string;
  ritual: string[];
  orden: number;
  momentoSugerido: string | null;
  descripcion: string;
  laFormula: FormulaItem[] | null;
  beneficios: string[];
  ritualDeUso: string;
  ingredientes: string | null;
  notaDePureza: string | null;
  origen: string | null;
  precio: number;
  formato: string | null;
  pesoNetoGramos: number | null;
  paqueteAltoCm: number | null;
  paqueteAnchoCm: number | null;
  paqueteProfundidadCm: number | null;
  stock: number;
  destacado: string | null;
  nombrePendiente: boolean;
  seoTitulo: string | null;
  seoDescripcion: string | null;
  vendidos: number | null;
  imagenes: ImagenDb[];
}

async function getProducto(slug: string): Promise<ProductoDb | null> {
  const res = await fetch(`${API_URL}/productos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /productos: ${res.status}`);
  const rows: ProductoDb[] = await res.json();
  return rows.find((p) => p.slug === slug) ?? null;
}

function toFormValues(p: ProductoDb): ProductoFormValues {
  return {
    slug: p.slug,
    nombre: p.nombre,
    formulaSubtitulo: p.formulaSubtitulo ?? "",
    linea: p.linea,
    ritual: p.ritual.map((r) => r.toLowerCase()),
    orden: String(p.orden),
    momentoSugerido: p.momentoSugerido ?? "",
    descripcion: p.descripcion,
    laFormula: p.laFormula ?? [],
    beneficios: p.beneficios,
    ritualDeUso: p.ritualDeUso,
    ingredientes: p.ingredientes ?? "",
    notaDePureza: p.notaDePureza ?? "",
    origen: p.origen ?? "",
    precio: String(p.precio),
    formato: p.formato ?? "",
    pesoNetoGramos: p.pesoNetoGramos != null ? String(p.pesoNetoGramos) : "",
    paqueteAltoCm: p.paqueteAltoCm != null ? String(p.paqueteAltoCm) : "",
    paqueteAnchoCm: p.paqueteAnchoCm != null ? String(p.paqueteAnchoCm) : "",
    paqueteProfundidadCm: p.paqueteProfundidadCm != null ? String(p.paqueteProfundidadCm) : "",
    stock: String(p.stock),
    destacado: p.destacado ?? "",
    nombrePendiente: p.nombrePendiente,
    seoTitulo: p.seoTitulo ?? "",
    seoDescripcion: p.seoDescripcion ?? "",
    vendidos: p.vendidos != null ? String(p.vendidos) : "",
  };
}

export default async function EditarProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) notFound();

  return (
    <>
      <div className="admin-main-head">
        <h1>{producto.nombre}</h1>
      </div>
      <ProductoForm
        initial={toFormValues(producto)}
        modoEdicion
        imagenes={producto.imagenes}
        onGuardar={actualizarProductoCompleto.bind(null, slug)}
        onSubirImagen={subirImagenProducto.bind(null, slug)}
        onEliminarImagen={eliminarImagenProducto.bind(null, slug)}
      />
    </>
  );
}
