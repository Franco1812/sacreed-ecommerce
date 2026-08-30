import Link from "next/link";
import { logout } from "../actions";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <span className="admin-brand">SACRED admin</span>
        <Link href="/admin/productos">Productos</Link>
        <Link href="/admin/combos">Combos</Link>
        <Link href="/admin/pedidos">Pedidos</Link>
        <form action={logout} className="admin-logout">
          <button type="submit">Cerrar sesión</button>
        </form>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
