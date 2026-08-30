import { notFound } from "next/navigation";
import { adminApiFetch } from "@/lib/admin-api";
import { formatPrecio } from "@/lib/format";
import { actualizarEstadoPedido } from "../../../actions";
import { EstadoBadge } from "../EstadoBadge";

const ESTADOS = [
  "PENDIENTE_PAGO",
  "PAGO_CONFIRMADO",
  "EN_PREPARACION",
  "ENVIADO",
  "LISTO_PARA_RETIRO",
  "ENTREGADO",
  "CANCELADA",
] as const;

interface PedidoItemDb {
  id: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

interface PedidoDb {
  numero: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: string;
  metodoPago: string;
  metodoEntrega: string;
  calle: string | null;
  numeroDom: string | null;
  piso: string | null;
  localidad: string | null;
  provincia: string | null;
  codigoPostal: string | null;
  barrioZona: string | null;
  notas: string | null;
  subtotal: number;
  costoEnvio: number;
  total: number;
  items: PedidoItemDb[];
}

async function getPedido(numero: number): Promise<PedidoDb | null> {
  const res = await adminApiFetch(`/pedidos/${numero}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /pedidos/${numero}: ${res.status}`);
  return res.json();
}

async function cambiarEstado(numero: number, formData: FormData) {
  "use server";
  const estado = String(formData.get("estado"));
  await actualizarEstadoPedido(numero, estado);
}

export default async function AdminPedidoDetallePage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const numeroInt = Number(numero);
  if (!Number.isInteger(numeroInt)) notFound();

  const pedido = await getPedido(numeroInt);
  if (!pedido) notFound();

  return (
    <>
      <div className="admin-main-head">
        <h1>Pedido #{pedido.numero}</h1>
        <EstadoBadge estado={pedido.estado} />
      </div>

      <section className="admin-block admin-card">
        <h2>Cambiar estado</h2>
        <form action={cambiarEstado.bind(null, pedido.numero)} className="admin-inline-form">
          <select name="estado" defaultValue={pedido.estado}>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button type="submit" className="admin-btn">Actualizar</button>
        </form>
      </section>

      <section className="admin-block">
        <h2>Cliente</h2>
        <p>{pedido.nombre} {pedido.apellido}</p>
        <p>{pedido.email} · {pedido.telefono}</p>
      </section>

      <section className="admin-block">
        <h2>Entrega</h2>
        {pedido.metodoEntrega === "RETIRO" ? (
          <p>Retiro</p>
        ) : (
          <>
            <p>{pedido.calle} {pedido.numeroDom}{pedido.piso ? `, ${pedido.piso}` : ""}</p>
            <p>{pedido.localidad}, {pedido.provincia} (CP {pedido.codigoPostal})</p>
            {pedido.barrioZona && <p>Zona: {pedido.barrioZona}</p>}
          </>
        )}
        <p>Pago: {pedido.metodoPago}</p>
        {pedido.notas && <p>Notas: {pedido.notas}</p>}
      </section>

      <section className="admin-block">
        <h2>Items</h2>
        {pedido.items.map((item) => (
          <div className="admin-item-row" key={item.id}>
            <span>{item.nombre} × {item.cantidad}</span>
            <span>{formatPrecio(item.precioUnitario * item.cantidad)}</span>
          </div>
        ))}
        <div className="admin-item-row">
          <span>Envío</span>
          <span>{pedido.costoEnvio === 0 ? "Sin cargo" : formatPrecio(pedido.costoEnvio)}</span>
        </div>
        <div className="admin-item-row admin-total">
          <span>Total</span>
          <span>{formatPrecio(pedido.total)}</span>
        </div>
      </section>
    </>
  );
}
