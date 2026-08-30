export type LineaSlug =
  | "foco-vitalidad"
  | "longevidad-glow"
  | "salud-intestinal"
  | "calma-alquimica";

export type RitualModo = "am" | "pm";

export interface FormulaItem {
  ingrediente: string;
  texto: string;
}

export interface ImagenItem {
  url: string;
  alt: string;
}

export interface Producto {
  slug: string;
  nombre: string;
  formulaSubtitulo?: string;
  linea: LineaSlug;
  ritual: RitualModo[];
  /** Orden global según §3.2 del brief — define la posición dentro de /rituales/am y /rituales/pm */
  orden: number;
  momentoSugerido?: string;
  descripcion: string;
  laFormula?: FormulaItem[];
  beneficios: string[];
  ritualDeUso: string;
  /** undefined = bloque pendiente de redactar por la marca (ver obs. §8.4 del brief) */
  ingredientes?: string;
  notaDePureza?: string;
  origen?: string;
  /** MOCK — precio real pendiente (§7) */
  precio: number;
  /** MOCK — formato real pendiente (§7) */
  formato: string;
  /** MOCK — stock real pendiente (§7) */
  stock: number;
  destacado?: string;
  /** true = nombre del producto todavía no definido por la marca (ver obs. §8.3) */
  nombrePendiente?: boolean;
  /** vacío/ausente = sin fotos cargadas todavía, la UI cae al placeholder */
  imagenes?: ImagenItem[];
}

export interface Combo {
  slug: string;
  nombre: string;
  bajada: string;
  /** slugs de productos que integran el combo */
  productos: string[];
  porQueSePotencian: string;
  ritual: RitualModo[];
  /** MOCK — precio real pendiente (§7) */
  precio: number;
  /** MOCK — stock real pendiente (§7) */
  stock: number;
  /** false = copy propuesto en §5.9, todavía no aprobado por la marca */
  copyAprobado: boolean;
  /** vacío/ausente = sin fotos cargadas todavía, la UI cae al placeholder */
  imagenes?: ImagenItem[];
}
