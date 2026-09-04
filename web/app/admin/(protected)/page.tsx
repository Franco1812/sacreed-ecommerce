import Link from "next/link";
import { adminApiFetch } from "@/lib/admin-api";
import { formatPrecio } from "@/lib/format";
import { EstadoBadge } from "./pedidos/EstadoBadge";

const STOCK_BAJO_UMBRAL = 5;
const ESTADOS_INGRESO = ["PAGO_CONFIRMADO", "EN_PREPARACION", "ENVIADO", "LISTO_PARA_RETIRO", "ENTREGADO"];
const ESTADOS_EN_CURSO = ["PAGO_CONFIRMADO", "EN_PREPARACION", "ENVIADO", "LISTO_PARA_RETIRO"];

interface PedidoResumen {
  numero: number;
  nombre: string;
  apellido: string;
  estado: string;
  total: number;
  createdAt: string;
}

interface ItemConStock {
  slug: string;
  nombre: string;
  stock: number;
}

async function getPedidos(): Promise<PedidoResumen[]> {
  const res = await adminApiFetch("/pedidos");
  if (!res.ok) throw new Error(`GET /pedidos: ${res.status}`);
  return res.json();
}

async function getItemsConStock(path: string): Promise<ItemConStock[]> {
  const res = await adminApiFetch(path);
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
  return res.json();
}

export default async function AdminDashboardPage() {
  const [pedidos, productos, combos] = await Promise.all([
    getPedidos(),
    getItemsConStock("/productos"),
    getItemsConStock("/combos"),
  ]);

  const ingresos = pedidos.filter((p) => ESTADOS_INGRESO.includes(p.estado)).reduce((acc, p) => acc + p.total, 0);
  const pendientes = pedidos.filter((p) => p.estado === "PENDIENTE_PAGO");
  const montoPendiente = pendientes.reduce((acc, p) => acc + p.total, 0);
  const enCurso = pedidos.filter((p) => ESTADOS_EN_CURSO.includes(p.estado)).length;
  const entregados = pedidos.filter((p) => p.estado === "ENTREGADO").length;

  const stockBajo = [
    ...productos.filter((p) => p.stock <= STOCK_BAJO_UMBRAL).map((p) => ({ ...p, tipo: "producto" as const })),
    ...combos.filter((c) => c.stock <= STOCK_BAJO_UMBRAL).map((c) => ({ ...c, tipo: "combo" as const })),
  ].sort((a, b) => a.stock - b.stock);

  const recientes = pedidos.slice(0, 6);

  return (
    <>
      <div className="admin-main-head">
        <h1>Panel</h1>
      </div>

      <div className="admin-hero-stat">
        <div className="admin-stat-label">Ingresos confirmados</div>
        <div className="admin-stat-value">{formatPrecio(ingresos)}</div>
        <div className="admin-stat-sub">Suma de pedidos con pago confirmado en adelante, todo el historial.</div>
      </div>

      <div className="admin-stat-row">
        <div className="admin-stat">
          <div className="admin-stat-label">Pendientes de pago</div>
          <div className="admin-stat-value">{pendientes.length}</div>
          <div className="admin-stat-sub">{formatPrecio(montoPendiente)} en juego</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-label">En curso</div>
          <div className="admin-stat-value">{enCurso}</div>
          <div className="admin-stat-sub">Confirmados hasta listos para entregar</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-label">Entregados</div>
          <div className="admin-stat-value">{entregados}</div>
          <div className="admin-stat-sub">Ciclo completo</div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <section>
          <h2 className="admin-panel-title">Stock bajo</h2>
          {stockBajo.length > 0 ? (
            <div className="admin-mini-list">
              {stockBajo.map((item) => (
                <Link
                  key={`${item.tipo}-${item.slug}`}
                  href={`/admin/${item.tipo === "producto" ? "productos" : "combos"}/${item.slug}/editar`}
                  className="admin-mini-list-item"
                >
                  <span>{item.nombre}</span>
                  <strong>{item.stock} u.</strong>
                </Link>
              ))}
            </div>
          ) : (
            <p className="admin-hint">Ningún producto ni combo por debajo de {STOCK_BAJO_UMBRAL} unidades.</p>
          )}
        </section>

        <section>
          <h2 className="admin-panel-title">Pedidos recientes</h2>
          {recientes.length > 0 ? (
            <div className="admin-mini-list">
              {recientes.map((p) => (
                <Link key={p.numero} href={`/admin/pedidos/${p.numero}`} className="admin-mini-list-item">
                  <span>#{p.numero} · {p.nombre} {p.apellido}</span>
                  <span className="admin-mini-list-meta">
                    {formatPrecio(p.total)}
                    <EstadoBadge estado={p.estado} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="admin-hint">Todavía no hay pedidos.</p>
          )}
        </section>
      </div>
    </>
  );
}
