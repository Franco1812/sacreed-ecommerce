import Link from "next/link";
import { logout } from "../actions";
import { adminApiFetch } from "@/lib/admin-api";
import { AdminNav } from "./AdminNav";

async function getPedidosPendientes(): Promise<number | undefined> {
  try {
    const res = await adminApiFetch("/pedidos");
    if (!res.ok) return undefined;
    const pedidos: { estado: string }[] = await res.json();
    return pedidos.filter((p) => p.estado === "PENDIENTE_PAGO").length;
  } catch {
    return undefined;
  }
}

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const pedidosPendientes = await getPedidosPendientes();

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

        <AdminNav pedidosPendientes={pedidosPendientes} />

        <form action={logout} className="admin-logout">
          <button type="submit">Cerrar sesión</button>
        </form>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
