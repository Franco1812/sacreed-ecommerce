import type { Combo, Producto } from "./types";

export interface ResultadoBusqueda {
  tipo: "producto" | "combo";
  item: Producto | Combo;
}

/** Minúsculas y sin tildes, para que "cafe" encuentre "Café". */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const CONECTORES = new Set(["de", "del", "la", "el", "los", "las", "en", "con", "y", "para"]);

function textoDeProducto(p: Producto): string {
  return [
    p.formulaSubtitulo,
    p.descripcion,
    p.ingredientes,
    p.destacado,
    ...p.beneficios,
    ...(p.laFormula ?? []).flatMap((f) => [f.ingrediente, f.texto]),
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Búsqueda por palabra sobre el catálogo que ya está cargado en el cliente (son pocos productos,
 * no hace falta ir a la API). Tienen que aparecer todas las palabras, en el nombre o en el resto
 * de la ficha (ingredientes, fórmula, beneficios); primero van los que coinciden por nombre.
 */
export function buscarEnCatalogo(consulta: string, productos: Producto[], combos: Combo[]): ResultadoBusqueda[] {
  const todas = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (todas.join("").length < 2) return [];
  // "aceite de coco" tiene que encontrar "Aceite coco MCT" por nombre: los conectores no cuentan.
  const sinConectores = todas.filter((w) => !CONECTORES.has(w));
  const palabras = sinConectores.length > 0 ? sinConectores : todas;

  const candidatos = [
    ...productos.map((p) => ({ tipo: "producto" as const, item: p, nombre: p.nombre, resto: textoDeProducto(p) })),
    ...combos.map((c) => ({
      tipo: "combo" as const,
      item: c,
      nombre: c.nombre,
      resto: [c.bajada, ...c.productos.map((slug) => productos.find((p) => p.slug === slug)?.nombre ?? "")].join(" "),
    })),
  ];

  const porNombre: ResultadoBusqueda[] = [];
  const porFicha: ResultadoBusqueda[] = [];
  for (const { tipo, item, nombre, resto } of candidatos) {
    const nombreNorm = normalizar(nombre);
    if (palabras.every((w) => nombreNorm.includes(w))) {
      porNombre.push({ tipo, item });
    } else {
      const todo = `${nombreNorm} ${normalizar(resto)}`;
      if (palabras.every((w) => todo.includes(w))) porFicha.push({ tipo, item });
    }
  }
  return [...porNombre, ...porFicha];
}
