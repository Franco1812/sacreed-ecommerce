/**
 * Constantes mock de envío en zona — duplicadas de web/lib/mock-data.ts a
 * propósito: son datos chicos y ya marcados como pendientes de la marca, no
 * ameritan un paquete compartido entre api/ y web/ (ver Registro del vault).
 */
export const ENVIO_GRATIS_ZONA_MOCK = 60000;
export const COSTO_ENVIO_ZONA_MOCK = 3500;
export const BARRIOS_ZONA_MOCK = [
  'Canning',
  'Adrogué',
  'Monte Grande',
  'Glew',
  'Ezeiza',
  'Longchamps',
] as const;
