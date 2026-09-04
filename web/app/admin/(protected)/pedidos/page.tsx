import Link from "next/link";
import { adminApiFetch } from "@/lib/admin-api";
import { formatPrecio } from "@/lib/format";
import { actualizarEstadoPedido } from "../../actions";
import { EstadoBadge } from "./EstadoBadge";

interface PedidoListItem {
  numero: number;
  nombre: string;
  apellido: string;
  estado: string;
  total: number;
  createdAt: string;
}

async function getPedidos(): Promise<PedidoListItem[]> {
  const res = await adminApiFetch("/pedidos");
  if (!res.ok) throw new Error(`GET /pedidos: ${res.status}`);
  return res.json();
}

async function confirmarPago(numero: number) {
  "use server";
  await actualizarEstadoPedido(numero, "PAGO_CONFIRMADO");
}

export default async function AdminPedidosPage() {
  const pedidos = await getPedidos();

  return (
    <>
      <div className="admin-main-head">
        <h1>Pedidos</h1>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.numero}>
              <td>
                <Link href={`/admin/pedidos/${p.numero}`}>#{p.numero}</Link>
              </td>
              <td>{p.nombre} {p.apellido}</td>
              <td>{formatPrecio(p.total)}</td>
              <td><EstadoBadge estado={p.estado} /></td>
              <td>{new Date(p.createdAt).toLocaleDateString("es-AR")}</td>
              <td>
                {p.estado === "PENDIENTE_PAGO" && (
                  <form action={confirmarPago.bind(null, p.numero)}>
                    <button type="submit" className="admin-btn-ghost">Confirmar pago</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
