"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import type { Linea } from "@/lib/types";

export default function Header({ lineas }: { lineas: Linea[] }) {
  const { totalItems } = useCart();

  return (
    <>
      <div className="mock-banner">🧪 Prototipo de UI — datos e imágenes de muestra, no reflejan precios ni fotos reales</div>

      <div className="ticker">
        Reparto propio en la zona todos los viernes · Envío sin cargo desde $[mínimo] <span>·</span> Entrega en Canning y zona sur <span>·</span> 15% de descuento pagando por transferencia
      </div>

      <header>
        <div className="wrap navbar">
          <nav className="nav-left">
            <button className="burger" aria-label="Abrir menú">
              <i></i><i></i><i></i>
            </button>
            <div className="has-mega">
              <Link href="/comprar-por-beneficio" className="nav-link">Comprar por Beneficio</Link>
              <div className="mega">
                <div>
                  <h5>Por beneficio</h5>
                  <ul>
                    {lineas.map((l) => (
                      <li key={l.slug}><Link href={`/comprar-por-beneficio/${l.slug}`}>{l.nombre}</Link></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5>Rituales</h5>
                  <ul>
                    <li><Link href="/rituales">Ver ambos</Link></li>
                    <li><Link href="/rituales/am">☀ Ritual AM</Link></li>
                    <li><Link href="/rituales/pm">☾ Ritual PM</Link></li>
                  </ul>
                </div>
                <div>
                  <h5>Combos</h5>
                  <ul>
                    <li><Link href="/combos">Todos los combos sinérgicos</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <Link href="/rituales" className="nav-link">Rituales AM / PM</Link>
            <Link href="/combos" className="nav-link">Combos Sinérgicos</Link>
          </nav>

          <Link href="/" className="brandmark" aria-label="SACRED — inicio">
            <svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
              <path d="M12 1c3.4 4.6 6.6 7.4 6.6 12.2 0 3.9-2.9 6.9-6.6 6.9s-6.6-3-6.6-6.9C5.4 8.4 8.6 5.6 12 1z" stroke="#B07E1E" strokeWidth="1.1"/>
              <path d="M4 23h16M8.5 26.5h7M11 29.5h2" stroke="#B07E1E" strokeWidth="1.1" strokeLinecap="square"/>
            </svg>
            <span className="wordmark">Sacred</span>
          </Link>

          <div className="nav-right">
            <Link href="/nuestro-origen" className="nav-link">Nuestro Origen</Link>
            <Link href="/admin/login" className="icon-btn">Ingresar</Link>
            <Link href="/carrito" className="icon-btn cart">Carrito <span className="cart-count">{totalItems}</span></Link>
          </div>
        </div>
      </header>
    </>
  );
}
