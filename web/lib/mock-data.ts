import type { LineaSlug, RitualModo } from "./types";

/**
 * Copy fijo de UI (líneas, rituales) y constantes mock de envío en zona.
 * El catálogo completo (17 productos + 8 combos) vive ahora en
 * api/prisma/seed-data.ts — es input del seed, no del frontend, desde que
 * el backend pasó a ser una API NestJS separada.
 */

/** MOCK — el brief deja este monto como definición pendiente de la marca (§7, item 2) */
export const ENVIO_GRATIS_ZONA_MOCK = 60000;

/** MOCK — costo fijo de reparto en zona por debajo del mínimo de envío gratis (§7) */
export const COSTO_ENVIO_ZONA_MOCK = 3500;

/**
 * MOCK — "Elegís tu barrio de una lista cerrada en el checkout" (ver /envios),
 * pero el brief no define esa lista todavía (§7). Arranco con la zona que ya
 * se menciona en el sitio (Canning y zona sur, ver Header).
 */
export const BARRIOS_ZONA_MOCK = [
  "Canning",
  "Adrogué",
  "Monte Grande",
  "Glew",
  "Ezeiza",
  "Longchamps",
] as const;

export const LINEAS: Record<LineaSlug, { nombre: string; texto: string }> = {
  "foco-vitalidad": {
    nombre: "Foco & Vitalidad",
    texto: "Plantas maestras y adaptógenos formulados para autorregular el sistema endocrino, despejar la mente y activar una fuerza vital pura y constante.",
  },
  "longevidad-glow": {
    nombre: "Longevidad & Glow",
    texto: "Elixires celulares diseñados para encender la luz de la piel desde adentro, proteger la matriz celular y rejuvenecer los tejidos con la fuerza de flores y hongos sagrados.",
  },
  "salud-intestinal": {
    nombre: "Salud Intestinal & Microbiota Sagrada",
    texto: "Nutrición viva, enzimas y botánica digestiva para cuidar tu segundo cerebro, desinflamar el cuerpo y cultivar un ecosistema interno próspero.",
  },
  "calma-alquimica": {
    nombre: "Calma Alquímica & Cortisol",
    texto: "Botánica adaptógena y tónicos de restauración formulados para desacelerar la mente, regular el sistema nervioso y reconectar con la paz interior.",
  },
};

export const RITUALES: Record<RitualModo, { titulo: string; texto: string }> = {
  am: {
    titulo: "RITUAL AM: Encendido, Claridad & Vitalidad Celular",
    texto: "El arte del despertar consciente. Fórmulas botánicas y minerales diseñados para activar la hidratación de tus glándulas, encender la mente y nutrir el cuerpo con energía limpia y sin agitación.",
  },
  pm: {
    titulo: "RITUAL PM: Desconexión, Calma & Restauración Nocturna",
    texto: "El arte de desacelerar. Medicinas botánicas, plantas adaptógenas y tónicos tibios formulados para indicarle a tu sistema nervioso que es momento de soltar, bajar el cortisol y retornar al centro.",
  },
};
