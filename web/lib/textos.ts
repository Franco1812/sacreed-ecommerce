/**
 * Textos editables del sitio (los que Cintia cambia en Admin → Textos y Páginas).
 * Server-only: los componentes cliente los reciben por props o por useSitio().
 *
 * Los textos pueden llevar marcas que se reemplazan acá:
 *   {envioGratis}  monto mínimo de envío gratis, ya formateado ($60.000)
 *   {costoEnvio}   costo fijo del reparto en zona
 * ({falta}, la de "te faltan…" del carrito, la resuelve el propio carrito porque depende de la compra.)
 */
import { cache } from "react";
import { getAjustes, getPaginaCruda, getTextosCrudos, type Ajustes, type PaginaTexto } from "./data";
import { formatPrecio } from "./format";

export type Textos = Record<string, string>;

export function conMarcas(texto: string, ajustes: Ajustes): string {
  return texto
    .replaceAll("{envioGratis}", formatPrecio(ajustes.envioGratisDesde))
    .replaceAll("{costoEnvio}", formatPrecio(ajustes.costoEnvioZona));
}

export const getTextos = cache(async (): Promise<Textos> => {
  const [crudos, ajustes] = await Promise.all([getTextosCrudos(), getAjustes()]);
  return Object.fromEntries(Object.entries(crudos).map(([clave, valor]) => [clave, conMarcas(valor, ajustes)]));
});

export async function getPagina(slug: string): Promise<PaginaTexto> {
  const [pagina, ajustes] = await Promise.all([getPaginaCruda(slug), getAjustes()]);
  return { ...pagina, cuerpo: conMarcas(pagina.cuerpo, ajustes) };
}
