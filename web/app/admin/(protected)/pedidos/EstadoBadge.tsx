const CLASES: Record<string, string> = {
  PENDIENTE_PAGO: "admin-badge-pendiente",
  PAGO_CONFIRMADO: "admin-badge-confirmado",
  EN_PREPARACION: "admin-badge-preparacion",
  ENVIADO: "admin-badge-enviado",
  LISTO_PARA_RETIRO: "admin-badge-retiro",
  ENTREGADO: "admin-badge-entregado",
  CANCELADA: "admin-badge-cancelada",
};

export function EstadoBadge({ estado }: { estado: string }) {
  return <span className={`admin-badge ${CLASES[estado] ?? ""}`}>{estado.replace(/_/g, " ")}</span>;
}
