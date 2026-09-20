import type { LineaBeneficio } from '../generated/prisma/client.js';

/**
 * Copy con el que arrancan las filas de contenido si la base todavía no las
 * tiene. Son exactamente los textos que estaban hardcodeados en el frontend
 * (web/app/(site)/page.tsx y web/lib/mock-data.ts) antes de hacerlos
 * editables — así el sitio se ve igual el día que se aplica la migración,
 * sin depender de correr un seed a mano en cada ambiente.
 */

export const HOME_DEFAULT = {
  heroEyebrow: 'Alacena funcional · Buenos Aires',
  heroTitulo: 'Delegá\nlo complejo.',
  heroTituloEnfasis: 'Quedáte con\nlo sagrado.',
  heroBajada:
    'Ingredientes funcionales elegidos uno por uno, con origen declarado y sin relleno. [Copy de hero pendiente de aprobación de marca — ver §7]',
  heroCta1Label: 'Comprar por beneficio',
  heroCta1Href: '/comprar-por-beneficio',
  heroCta2Label: 'Armar mi ritual',
  heroCta2Href: '/rituales',
  beneficiosEyebrow: 'Entrada principal a la tienda',
  beneficiosTitulo: 'Comprá por beneficio',
  masVendidosEyebrow: 'Lo que más se repite',
  masVendidosTitulo: 'Los más vendidos',
};

export const LINEAS_DEFAULT: { id: LineaBeneficio; nombre: string; texto: string; orden: number }[] = [
  {
    id: 'FOCO_VITALIDAD',
    nombre: 'Foco & Vitalidad',
    texto:
      'Plantas maestras y adaptógenos formulados para autorregular el sistema endocrino, despejar la mente y activar una fuerza vital pura y constante.',
    orden: 0,
  },
  {
    id: 'LONGEVIDAD_GLOW',
    nombre: 'Longevidad & Glow',
    texto:
      'Elixires celulares diseñados para encender la luz de la piel desde adentro, proteger la matriz celular y rejuvenecer los tejidos con la fuerza de flores y hongos sagrados.',
    orden: 1,
  },
  {
    id: 'SALUD_INTESTINAL',
    nombre: 'Salud Intestinal & Microbiota Sagrada',
    texto:
      'Nutrición viva, enzimas y botánica digestiva para cuidar tu segundo cerebro, desinflamar el cuerpo y cultivar un ecosistema interno próspero.',
    orden: 2,
  },
  {
    id: 'CALMA_ALQUIMICA',
    nombre: 'Calma Alquímica & Cortisol',
    texto:
      'Botánica adaptógena y tónicos de restauración formulados para desacelerar la mente, regular el sistema nervioso y reconectar con la paz interior.',
    orden: 3,
  },
];
