"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/combos", label: "Combos" },
];

export function AdminNav({ pedidosPendientes }: { pedidosPendientes?: number }) {
  const pathname = usePathname();

  return (
    <div className="admin-nav-list">
      {ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} data-active={active}>
            <span>{item.label}</span>
            {item.href === "/admin/pedidos" && !!pedidosPendientes && (
              <span className="admin-nav-badge">{pedidosPendientes}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
