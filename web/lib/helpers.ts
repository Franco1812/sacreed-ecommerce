import { getAllCombos, getAllProductos } from "./data";
import type { Combo, Producto, RitualModo } from "./types";

export async function getProducto(slug: string): Promise<Producto | undefined> {
  const productos = await getAllProductos();
  return productos.find((p) => p.slug === slug);
}

export async function getCombo(slug: string): Promise<Combo | undefined> {
  const combos = await getAllCombos();
  return combos.find((c) => c.slug === slug);
}

export async function productosPorLinea(lineaSlug: string): Promise<Producto[]> {
  const productos = await getAllProductos();
  return productos.filter((p) => p.linea === lineaSlug);
}

export async function productosPorRitual(modo: RitualModo): Promise<Producto[]> {
  const productos = await getAllProductos();
  return productos.filter((p) => p.ritual.includes(modo)).sort((a, b) => a.orden - b.orden);
}

export async function combosPorRitual(modo: RitualModo): Promise<Combo[]> {
  const combos = await getAllCombos();
  return combos.filter((c) => c.ritual.includes(modo));
}

export async function combosParaProducto(slug: string): Promise<Combo[]> {
  const combos = await getAllCombos();
  return combos.filter((c) => c.productos.includes(slug));
}

export async function relacionadosMismaLinea(slug: string, limit = 4): Promise<Producto[]> {
  const productos = await getAllProductos();
  const p = productos.find((x) => x.slug === slug);
  if (!p) return [];
  return productos.filter((x) => x.linea === p.linea && x.slug !== slug).slice(0, limit);
}

export async function comboProductos(combo: Combo): Promise<Producto[]> {
  const productos = await getAllProductos();
  return combo.productos
    .map((slug) => productos.find((p) => p.slug === slug))
    .filter((p): p is Producto => Boolean(p));
}

export interface ProductoConVentas {
  producto: Producto;
  vendidos: number;
}

/**
 * Curado a mano desde el admin (campo "Vendidos" en la ficha de producto) —
 * no hay todavía un conteo real derivado de pedidos (eso vive en OrderItem,
 * que recién se está armando en el checkout). Devuelve los productos con
 * `vendidos` cargado (> 0), ordenados de mayor a menor. Si Cintia no cargó
 * ninguno todavía, devuelve un array vacío y la sección no se muestra.
 */
export async function productosMasVendidos(limit = 4): Promise<ProductoConVentas[]> {
  const productos = await getAllProductos();
  return productos
    .filter((p): p is Producto & { vendidos: number } => Boolean(p.vendidos && p.vendidos > 0))
    .sort((a, b) => b.vendidos - a.vendidos)
    .slice(0, limit)
    .map((producto) => ({ producto, vendidos: producto.vendidos }));
}
