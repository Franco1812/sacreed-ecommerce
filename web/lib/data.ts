/**
 * Capa de acceso a datos — le pega a la API NestJS (api/), que es la única
 * que habla con Postgres. Server-only: no importar desde un componente
 * cliente ("use client"), y `API_URL` no lleva prefijo NEXT_PUBLIC_ porque
 * nunca se llama desde el browser.
 *
 * Dos capas de cache:
 * - `unstable_cache` (Next) persiste el resultado entre requests por
 *   CACHE_REVALIDATE_SEGUNDOS, para no pegarle a la API en cada pageview —
 *   esto es lo que hace que la app se sienta rápida.
 * - React `cache()` dedupea múltiples llamadas dentro del mismo render
 *   (varias funciones de lib/helpers.ts pidiendo lo mismo en una página).
 *
 * Sin admin todavía, los únicos cambios a la base son manuales (scripts,
 * Prisma Studio en api/) — por eso el revalidate es corto (ver
 * CACHE_REVALIDATE_SEGUNDOS) en vez de tener invalidación on-demand con
 * revalidateTag. Cuando exista un admin, sus mutaciones deberían llamar
 * `revalidateTag("productos")`/`revalidateTag("combos")` para que los
 * cambios se vean al instante en vez de esperar la ventana de revalidate.
 */
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Combo, FormulaItem, ImagenItem, LineaSlug, Producto, RitualModo } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

// Shape crudo que devuelve la API (espejo de los modelos de Prisma en api/prisma/schema.prisma).
type LineaBeneficioDb = "FOCO_VITALIDAD" | "LONGEVIDAD_GLOW" | "SALUD_INTESTINAL" | "CALMA_ALQUIMICA";
type RitualDb = "AM" | "PM";

interface ImagenDb {
  url: string;
  alt: string;
}

interface ProductoDb {
  slug: string;
  nombre: string;
  formulaSubtitulo: string | null;
  linea: LineaBeneficioDb;
  ritual: RitualDb[];
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
  stock: number;
  destacado: string | null;
  nombrePendiente: boolean;
  imagenes: ImagenDb[];
}

interface ComboDb {
  slug: string;
  nombre: string;
  bajada: string;
  productos: { producto: { slug: string } }[];
  porQueSePotencian: string;
  ritual: RitualDb[];
  precio: number;
  stock: number;
  copyAprobado: boolean;
  imagenes: ImagenDb[];
}

const LINEA_TO_SLUG: Record<LineaBeneficioDb, LineaSlug> = {
  FOCO_VITALIDAD: "foco-vitalidad",
  LONGEVIDAD_GLOW: "longevidad-glow",
  SALUD_INTESTINAL: "salud-intestinal",
  CALMA_ALQUIMICA: "calma-alquimica",
};

const RITUAL_TO_MODO: Record<RitualDb, RitualModo> = { AM: "am", PM: "pm" };

function mapImagenes(imagenes: ImagenDb[]): ImagenItem[] {
  return imagenes.map((img) => ({ url: img.url, alt: img.alt }));
}

function mapProducto(p: ProductoDb): Producto {
  return {
    slug: p.slug,
    nombre: p.nombre,
    formulaSubtitulo: p.formulaSubtitulo ?? undefined,
    linea: LINEA_TO_SLUG[p.linea],
    ritual: p.ritual.map((r) => RITUAL_TO_MODO[r]),
    orden: p.orden,
    momentoSugerido: p.momentoSugerido ?? undefined,
    descripcion: p.descripcion,
    laFormula: p.laFormula ?? undefined,
    beneficios: p.beneficios,
    ritualDeUso: p.ritualDeUso,
    ingredientes: p.ingredientes ?? undefined,
    notaDePureza: p.notaDePureza ?? undefined,
    origen: p.origen ?? undefined,
    precio: p.precio,
    formato: p.formato ?? "PENDIENTE",
    stock: p.stock,
    destacado: p.destacado ?? undefined,
    nombrePendiente: p.nombrePendiente,
    imagenes: mapImagenes(p.imagenes),
  };
}

function mapCombo(c: ComboDb): Combo {
  return {
    slug: c.slug,
    nombre: c.nombre,
    bajada: c.bajada,
    productos: c.productos.map((cp) => cp.producto.slug),
    porQueSePotencian: c.porQueSePotencian,
    ritual: c.ritual.map((r) => RITUAL_TO_MODO[r]),
    precio: c.precio,
    stock: c.stock,
    copyAprobado: c.copyAprobado,
    imagenes: mapImagenes(c.imagenes),
  };
}

/** Sin admin con revalidateTag todavía: corto a propósito, ver comentario arriba. */
const CACHE_REVALIDATE_SEGUNDOS = 60;

export const getAllProductos = cache(
  unstable_cache(
    async (): Promise<Producto[]> => {
      const res = await fetch(`${API_URL}/productos`);
      if (!res.ok) throw new Error(`GET /productos: ${res.status}`);
      const rows: ProductoDb[] = await res.json();
      return rows.map(mapProducto);
    },
    ["productos"],
    { tags: ["productos"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

export const getAllCombos = cache(
  unstable_cache(
    async (): Promise<Combo[]> => {
      const res = await fetch(`${API_URL}/combos`);
      if (!res.ok) throw new Error(`GET /combos: ${res.status}`);
      const rows: ComboDb[] = await res.json();
      return rows.map(mapCombo);
    },
    ["combos"],
    { tags: ["combos"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);
