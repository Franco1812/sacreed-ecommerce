/** Campos de texto de la portada y de la sección de beneficios (espejo de ContenidoHome en api/). */
export const CAMPOS_HOME = [
  "heroEyebrow",
  "heroTitulo",
  "heroTituloEnfasis",
  "heroBajada",
  "heroCta1Label",
  "heroCta1Href",
  "heroCta2Label",
  "heroCta2Href",
  "beneficiosEyebrow",
  "beneficiosTitulo",
  "masVendidosEyebrow",
  "masVendidosTitulo",
] as const;

export type HomeValues = Record<(typeof CAMPOS_HOME)[number], string>;

export interface LineaValue {
  id: string;
  nombre: string;
  texto: string;
}

/** Un producto de "Los más vendidos"; `vendidos` es texto porque vive en un <input>. */
export interface MasVendidoValue {
  slug: string;
  vendidos: string;
}

/** Producto elegible para la lista de más vendidos. */
export interface ProductoOpcion {
  slug: string;
  nombre: string;
  foto?: string;
}

export const MAS_VENDIDOS_MAX = 8;

export interface HeroFotoValue {
  id: string;
  url: string;
  alt: string;
}
