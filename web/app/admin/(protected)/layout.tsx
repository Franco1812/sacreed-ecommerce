import { Suspense } from "react";
import Link from "next/link";
import { logout } from "../actions";
import { adminApiFetch } from "@/lib/admin-api";
import { AdminNav } from "./AdminNav";

/** El numerito de pedidos pendientes. Va aparte, en un Suspense, para que el menú no espere a la API. */
async function getPedidosPendientes(): Promise<number> {
  try {
    const res = await adminApiFetch("/pedidos/pendientes");
    if (!res.ok) return 0;
    const { pendientes }: { pendientes: number } = await res.json();
    return pendientes;
  } catch {
    return 0;
  }
}

async function PedidosPendientes() {
  const pendientes = await getPedidosPendientes();
  return pendientes > 0 ? <span className="admin-nav-badge">{pendientes}</span> : null;
}

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin" className="admin-brand">
          <svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
            <path d="M12 1c3.4 4.6 6.6 7.4 6.6 12.2 0 3.9-2.9 6.9-6.6 6.9s-6.6-3-6.6-6.9C5.4 8.4 8.6 5.6 12 1z" stroke="#B07E1E" strokeWidth="1.1" />
            <path d="M4 23h16M8.5 26.5h7M11 29.5h2" stroke="#B07E1E" strokeWidth="1.1" strokeLinecap="square" />
          </svg>
          <span>Sacred</span>
        </Link>

        <AdminNav
          pedidosPendientes={
            <Suspense fallback={null}>
              <PedidosPendientes />
            </Suspense>
          }
        />

        <form action={logout} className="admin-logout">
          <button type="submit">Cerrar sesión</button>
        </form>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
