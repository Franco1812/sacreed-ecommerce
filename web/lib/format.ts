import type { RitualModo } from "./types";

export function formatPrecio(centavos: number): string {
  return "$" + centavos.toLocaleString("es-AR");
}

export function ritualLabel(ritual: RitualModo[]): string {
  const labels: string[] = [];
  if (ritual.includes("am")) labels.push("Ritual AM");
  if (ritual.includes("pm")) labels.push("Ritual PM");
  return labels.join(" · ");
}
