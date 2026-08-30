"use server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export interface CrearPedidoItem {
  slug: string;
  tipo: "producto" | "combo";
  cantidad: number;
}

export interface CrearPedidoInput {
  items: CrearPedidoItem[];
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  metodoEntrega: "ENVIO_DOMICILIO" | "RETIRO";
  calle: string;
  numeroDom: string;
  piso: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  barrioZona: string;
  metodoPago: "TRANSFERENCIA" | "EFECTIVO";
  notas: string;
}

export type CrearPedidoResult = { ok: true; numero: number } | { ok: false; error: string };

/**
 * Reenvía el pedido a la API (api/) — toda la validación de precio/stock/
 * envío vive ahí, no acá (ver PedidosService en api/src/pedidos). Esta
 * Server Action es solo el puente entre el carrito del cliente y la API.
 */
export async function crearPedido(input: CrearPedidoInput): Promise<CrearPedidoResult> {
  if (input.items.length === 0) return { ok: false, error: "Tu carrito está vacío." };

  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (res.status === 400) {
    const body = await res.json();
    const mensaje = Array.isArray(body.message) ? body.message.join(" ") : body.message;
    return { ok: false, error: mensaje ?? "No pudimos procesar tu pedido." };
  }
  if (!res.ok) return { ok: false, error: "No pudimos procesar tu pedido. Probá de nuevo en unos minutos." };

  return res.json();
}
