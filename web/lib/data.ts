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
import type { Combo, ContenidoHome, FormulaItem, ImagenItem, Linea, LineaSlug, Producto, RitualModo } from "./types";

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
  vendidos: number | null;
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
    vendidos: p.vendidos ?? undefined,
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

interface LineaDb {
  id: LineaBeneficioDb;
  nombre: string;
  texto: string;
  orden: number;
}

export const getLineas = cache(
  unstable_cache(
    async (): Promise<Linea[]> => {
      const res = await fetch(`${API_URL}/contenido/lineas`);
      if (!res.ok) throw new Error(`GET /contenido/lineas: ${res.status}`);
      const rows: LineaDb[] = await res.json();
      return rows.map((l) => ({ id: l.id, slug: LINEA_TO_SLUG[l.id], nombre: l.nombre, texto: l.texto }));
    },
    ["lineas"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

export const getHeroImagenes = cache(
  unstable_cache(
    async (): Promise<ImagenItem[]> => {
      const res = await fetch(`${API_URL}/contenido/hero-imagenes`);
      if (!res.ok) throw new Error(`GET /contenido/hero-imagenes: ${res.status}`);
      return mapImagenes(await res.json());
    },
    ["hero-imagenes"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

/** Slugs de "Los más vendidos" en el orden que armó el admin, con el número opcional del "+N vendidos". */
export const getMasVendidos = cache(
  unstable_cache(
    async (): Promise<{ slug: string; vendidos: number | null }[]> => {
      const res = await fetch(`${API_URL}/contenido/mas-vendidos`);
      if (!res.ok) throw new Error(`GET /contenido/mas-vendidos: ${res.status}`);
      return res.json();
    },
    ["mas-vendidos"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

/** Valores editables que también cobra el servidor: envío gratis, costo del reparto y barrios de la zona. */
export interface Ajustes {
  envioGratisDesde: number;
  costoEnvioZona: number;
  barriosZona: string[];
}

export const getAjustes = cache(
  unstable_cache(
    async (): Promise<Ajustes> => {
      const res = await fetch(`${API_URL}/contenido/ajustes`);
      if (!res.ok) throw new Error(`GET /contenido/ajustes: ${res.status}`);
      return res.json();
    },
    ["ajustes"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

/** Textos editables del sitio (clave → valor) tal cual los guarda la API, sin resolver las marcas {envioGratis}. Usar getTextos() de lib/textos.ts. */
export const getTextosCrudos = cache(
  unstable_cache(
    async (): Promise<Record<string, string>> => {
      const res = await fetch(`${API_URL}/contenido/textos`);
      if (!res.ok) throw new Error(`GET /contenido/textos: ${res.status}`);
      return res.json();
    },
    ["textos"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

export interface PaginaTexto {
  slug: string;
  titulo: string;
  cuerpo: string;
}

/** Página de texto editable (Nuestro Origen, Envíos…), sin resolver las marcas. Usar getPagina() de lib/textos.ts. */
export const getPaginaCruda = cache(
  unstable_cache(
    async (slug: string): Promise<PaginaTexto> => {
      const res = await fetch(`${API_URL}/contenido/paginas/${slug}`);
      if (!res.ok) throw new Error(`GET /contenido/paginas/${slug}: ${res.status}`);
      return res.json();
    },
    ["pagina"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);

export const getContenidoHome = cache(
  unstable_cache(
    async (): Promise<ContenidoHome> => {
      const res = await fetch(`${API_URL}/contenido/home`);
      if (!res.ok) throw new Error(`GET /contenido/home: ${res.status}`);
      return res.json();
    },
    ["contenido-home"],
    { tags: ["contenido"], revalidate: CACHE_REVALIDATE_SEGUNDOS }
  )
);
