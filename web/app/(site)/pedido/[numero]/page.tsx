import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatPrecio } from "@/lib/format";
import { getTextos } from "@/lib/textos";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface PedidoItemDb {
  id: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

interface PedidoDb {
  numero: number;
  nombre: string;
  metodoPago: "TRANSFERENCIA" | "EFECTIVO" | "MERCADO_PAGO";
  metodoEntrega: "ENVIO_DOMICILIO" | "RETIRO";
  calle: string | null;
  numeroDom: string | null;
  piso: string | null;
  localidad: string | null;
  provincia: string | null;
  codigoPostal: string | null;
  barrioZona: string | null;
  costoEnvio: number;
  total: number;
  items: PedidoItemDb[];
}

export default async function PedidoConfirmadoPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const numeroInt = Number(numero);
  if (!Number.isInteger(numeroInt)) notFound();

  const res = await fetch(`${API_URL}/pedidos/${numeroInt}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`GET /pedidos/${numeroInt}: ${res.status}`);
  const pedido: PedidoDb = await res.json();

  // Datos de la cuenta que carga Cintia en Admin → Envíos y pagos; lo que esté vacío no se muestra.
  const t = await getTextos();
  const datosCuenta = [
    ["Titular", t["pago.titular"]],
    ["Banco", t["pago.banco"]],
    ["CBU / CVU", t["pago.cbu"]],
    ["Alias", t["pago.alias"]],
    ["CUIT / CUIL", t["pago.cuit"]],
  ].filter(([, valor]) => valor?.trim());

  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: `Pedido #${pedido.numero}` }]} />

      <div className="confirm-page">
        <span className="eyebrow">Pedido #{pedido.numero} · Pendiente de pago</span>
        <h1>Gracias, {pedido.nombre}.</h1>
        <p className="lead">
          Tu pedido quedó registrado. En cuanto confirmemos el pago te avisamos por email o WhatsApp y lo pasamos a preparación.
        </p>

        <div className="confirm-block">
          <h2>Cómo pagar</h2>
          {pedido.metodoPago === "TRANSFERENCIA" ? (
            datosCuenta.length > 0 ? (
              <>
                <p>Transferí el total ({formatPrecio(pedido.total)}) a esta cuenta:</p>
                <ul className="confirm-cuenta">
                  {datosCuenta.map(([etiqueta, valor]) => (
                    <li key={etiqueta}><span>{etiqueta}</span><strong>{valor}</strong></li>
                  ))}
                </ul>
                {t["pago.instrucciones"] && <p>{t["pago.instrucciones"]}</p>}
              </>
            ) : (
              <p>Te contactamos por email o WhatsApp con los datos para transferir y coordinar el pago.</p>
            )
          ) : (
            <p>Pagás en efectivo al momento de {pedido.metodoEntrega === "RETIRO" ? "retirar" : "recibir"} tu pedido.</p>
          )}
        </div>

        <div className="confirm-block">
          <h2>Entrega</h2>
          {pedido.metodoEntrega === "RETIRO" ? (
            <p>Retiro — te contactamos para coordinar punto y horario.</p>
          ) : (
            <>
              <p>{pedido.calle} {pedido.numeroDom}{pedido.piso ? `, ${pedido.piso}` : ""}</p>
              <p>{pedido.localidad}, {pedido.provincia} (CP {pedido.codigoPostal})</p>
              {pedido.barrioZona && <p>Zona de reparto: {pedido.barrioZona} · viernes</p>}
            </>
          )}
        </div>

        <div className="confirm-block">
          <h2>Tu pedido</h2>
          {pedido.items.map((item) => (
            <div className="confirm-item" key={item.id}>
              <span>{item.nombre} × {item.cantidad}</span>
              <span>{formatPrecio(item.precioUnitario * item.cantidad)}</span>
            </div>
          ))}
          <div className="confirm-item">
            <span>Envío</span>
            <span>{pedido.costoEnvio === 0 ? "Sin cargo" : formatPrecio(pedido.costoEnvio)}</span>
          </div>
          <div className="confirm-total">
            <span>Total</span>
            <span>{formatPrecio(pedido.total)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
