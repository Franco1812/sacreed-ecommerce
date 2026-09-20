import { getAllCombos, getAllProductos, getMasVendidos } from "./data";
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
  /** "+N vendidos" de la tarjeta; undefined = sin número. */
  vendidos?: number;
}

/**
 * Lista armada a mano desde el admin (Contenido → Más vendidos): qué productos
 * y en qué orden. No hay conteo real de ventas derivado de pedidos, así que el
 * "+N vendidos" es un número opcional que carga Cintia. Si la lista está vacía,
 * la sección no se muestra.
 */
export async function productosMasVendidos(): Promise<ProductoConVentas[]> {
  const [lista, productos] = await Promise.all([getMasVendidos(), getAllProductos()]);
  return lista.flatMap(({ slug, vendidos }) => {
    const producto = productos.find((p) => p.slug === slug);
    return producto ? [{ producto, vendidos: vendidos && vendidos > 0 ? vendidos : undefined }] : [];
  });
}
