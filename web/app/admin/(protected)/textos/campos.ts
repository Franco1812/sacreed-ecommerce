/** Lo que devuelve GET /contenido/textos/campos (registro en api/src/contenido/contenido.registro.ts). */
export type TipoCampo = "texto" | "largo" | "numero" | "lista" | "imagen";

export interface GrupoTexto {
  id: string;
  titulo: string;
  descripcion: string;
  pantalla: "portada" | "tienda" | "envios";
}

/** Lo que devuelve GET /contenido/textos/campos. */
export interface RegistroTextos {
  grupos: GrupoTexto[];
  campos: CampoTexto[];
}

/** Valor actual de cada campo (todos los grupos): las vistas previas lo usan para lo que no se edita en esa pantalla, ej. el monto de envío gratis. */
export function valoresActuales(campos: CampoTexto[]): Record<string, string> {
  return Object.fromEntries(campos.map((c) => [c.clave, c.valor]));
}

export interface CampoTexto {
  clave: string;
  grupo: string;
  etiqueta: string;
  ayuda?: string;
  tipo: TipoCampo;
  /** Lo que dice el sitio si nadie lo cambió. */
  porDefecto: string;
  /** Lo que dice ahora (para las fotos, la URL). */
  valor: string;
}
