/** Lo que devuelve GET /contenido/textos/campos (registro en api/src/contenido/contenido.registro.ts). */
export type TipoCampo = "texto" | "largo" | "numero" | "lista" | "imagen";

export interface GrupoTexto {
  id: string;
  titulo: string;
  descripcion: string;
  pantalla: "textos" | "envios";
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
