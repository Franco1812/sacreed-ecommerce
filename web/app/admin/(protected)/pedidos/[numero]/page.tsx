import { notFound } from "next/navigation";
import { adminApiFetch } from "@/lib/admin-api";
import { formatPrecio } from "@/lib/format";
import { actualizarEstadoPedido, subirComprobantePedido, eliminarComprobantePedido } from "../../../actions";
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

interface AccionEstado {
  estado: string;
  label: string;
  danger?: boolean;
}

function proximasAcciones(estado: string, metodoEntrega: string): AccionEstado[] {
  switch (estado) {
    case "PENDIENTE_PAGO":
      return [
        { estado: "PAGO_CONFIRMADO", label: "Confirmar pago" },
        { estado: "CANCELADA", label: "Cancelar pedido", danger: true },
      ];
    case "PAGO_CONFIRMADO":
      return [
        { estado: "EN_PREPARACION", label: "Marcar en preparación" },
        { estado: "CANCELADA", label: "Cancelar pedido", danger: true },
      ];
    case "EN_PREPARACION":
      return metodoEntrega === "RETIRO"
        ? [{ estado: "LISTO_PARA_RETIRO", label: "Marcar listo para retirar" }]
        : [{ estado: "ENVIADO", label: "Marcar enviado" }];
    case "ENVIADO":
    case "LISTO_PARA_RETIRO":
      return [{ estado: "ENTREGADO", label: "Marcar entregado" }];
    default:
      return [];
  }
}

interface PedidoItemDb {
  id: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

interface ImagenDb {
  id: string;
  url: string;
  alt: string;
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
  imagenes: ImagenDb[];
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

async function subirComprobante(numero: number, formData: FormData) {
  "use server";
  await subirComprobantePedido(numero, formData);
}

async function eliminarComprobante(numero: number, imagenId: string) {
  "use server";
  await eliminarComprobantePedido(numero, imagenId);
}

export default async function AdminPedidoDetallePage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const numeroInt = Number(numero);
  if (!Number.isInteger(numeroInt)) notFound();

  const pedido = await getPedido(numeroInt);
  if (!pedido) notFound();

  const acciones = proximasAcciones(pedido.estado, pedido.metodoEntrega);

  return (
    <>
      <div className="admin-main-head">
        <h1>Pedido #{pedido.numero}</h1>
        <EstadoBadge estado={pedido.estado} />
      </div>

      <section className="admin-block admin-card">
        <h2>Estado</h2>
        {acciones.length > 0 ? (
          <div className="admin-accion-row">
            {acciones.map((a) => (
              <form key={a.estado} action={cambiarEstado.bind(null, pedido.numero)}>
                <input type="hidden" name="estado" value={a.estado} />
                <button type="submit" className={a.danger ? "admin-btn-ghost admin-btn-danger" : "admin-btn"}>
                  {a.label}
                </button>
              </form>
            ))}
          </div>
        ) : (
          <p className="admin-hint">Este pedido ya está en un estado final.</p>
        )}

        <details className="admin-details">
          <summary>Cambiar a otro estado manualmente</summary>
          <form action={cambiarEstado.bind(null, pedido.numero)} className="admin-inline-form">
            <select name="estado" defaultValue={pedido.estado}>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e.replace(/_/g, " ")}</option>
              ))}
            </select>
            <button type="submit" className="admin-btn-ghost">Actualizar</button>
          </form>
        </details>
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

      <section className="admin-block">
        <h2>Comprobante de pago</h2>
        {pedido.imagenes.length > 0 && (
          <div className="admin-gallery">
            {pedido.imagenes.map((img) => (
              <div className="admin-gallery-item" key={img.id}>
                {/* eslint-disable-next-line @next/next/no-img-element -- galería de admin, no vale la pena next/image acá */}
                <img src={img.url} alt={img.alt} />
                <form action={eliminarComprobante.bind(null, pedido.numero, img.id)}>
                  <button type="submit">Quitar</button>
                </form>
              </div>
            ))}
          </div>
        )}
        <form action={subirComprobante.bind(null, pedido.numero)} className="admin-inline-form">
          <input type="file" name="file" accept="image/*" required />
          <button type="submit" className="admin-btn-ghost">Subir comprobante</button>
        </form>
      </section>
    </>
  );
}
