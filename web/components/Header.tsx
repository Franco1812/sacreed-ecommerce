"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icons";
import { useCart } from "@/lib/cart-context";
import type { Combo, Linea, Producto } from "@/lib/types";

// Un solo mensaje por vez, rotando cada 5 s (referencia: Moon Juice). Los mensajes los edita Cintia en Admin → Textos.
function BarraDeAnuncios({ anuncios }: { anuncios: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (anuncios.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % anuncios.length), 5000);
    return () => clearInterval(id);
  }, [anuncios.length]);

  if (anuncios.length === 0) return null;
  return (
    <div className="ticker" role="status" aria-live="polite">
      {anuncios[i % anuncios.length]}
    </div>
  );
}

export default function Header({
  lineas,
  combos,
  masVendidos,
  anuncios,
}: {
  lineas: Linea[];
  combos: Combo[];
  masVendidos: Producto[];
  anuncios: string[];
}) {
  const { totalItems, abrir } = useCart();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrar = () => setMenuAbierto(false);

  return (
    <>
      <BarraDeAnuncios anuncios={anuncios} />

      <header>
        <div className="wrap navbar">
          <nav className="nav-left" aria-label="Principal">
            <button
              type="button"
              className="burger"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
              onClick={() => setMenuAbierto((v) => !v)}
            >
              <i></i><i></i><i></i>
            </button>
            <div className="has-mega">
              <Link href="/comprar-por-beneficio" className="nav-link">Comprar</Link>
              <div className="mega">
                <div className="wrap mega-grid">
                  <div>
                    <h5>Más vendidos</h5>
                    <ul className={masVendidos.length > 6 ? "two-cols" : undefined}>
                      {masVendidos.map((p) => (
                        <li key={p.slug}><Link href={`/producto/${p.slug}`}>{p.nombre}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Comprar por beneficio</h5>
                    <ul>
                      {lineas.map((l) => (
                        <li key={l.slug}><Link href={`/comprar-por-beneficio/${l.slug}`}>{l.nombre}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Rituales</h5>
                    <ul>
                      <li><Link href="/rituales/am">Ritual AM</Link></li>
                      <li><Link href="/rituales/pm">Ritual PM</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h5>Combos sinérgicos</h5>
                    <ul>
                      {combos.map((c) => (
                        <li key={c.slug}><Link href={`/combos/${c.slug}`}>{c.nombre}</Link></li>
                      ))}
                      <li><Link href="/combos" className="mega-all">Todos los combos</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/rituales" className="nav-link">Rituales</Link>
            <Link href="/combos" className="nav-link">Combos</Link>
            <Link href="/nuestro-origen" className="nav-link">Nuestro Origen</Link>
          </nav>

          <Link href="/" className="brandmark" aria-label="SACRED Wellness Club — inicio" onClick={cerrar}>
            <Image src="/logo-badge-v3.png" alt="SACRED Wellness Club" width={480} height={463} priority className="brand-badge" />
          </Link>

          <div className="nav-right">
            <Link href="/admin/login" className="icon-btn" aria-label="Mi cuenta">
              <Icon name="user" />
            </Link>
            <button
              type="button"
              className="icon-btn cart"
              aria-label={`Abrir carrito, ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
              onClick={abrir}
            >
              <Icon name="bag" />
              {totalItems > 0 && <span className="cart-dot" aria-hidden="true"></span>}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <nav className="mobile-menu" aria-label="Menú">
            <Link href="/comprar-por-beneficio" onClick={cerrar}>Comprar</Link>
            <Link href="/rituales" onClick={cerrar}>Rituales</Link>
            <Link href="/combos" onClick={cerrar}>Combos</Link>
            <Link href="/nuestro-origen" onClick={cerrar}>Nuestro Origen</Link>
          </nav>
        )}
      </header>
    </>
  );
}
