"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icons";
import { buscarEnCatalogo } from "@/lib/buscar";
import { useCart } from "@/lib/cart-context";
import { formatPrecio } from "@/lib/format";
import type { Combo } from "@/lib/types";

const MAX_RESULTADOS = 8;

/**
 * Buscador por palabra: panel que se despliega debajo del header (lo abre la lupa) y va
 * mostrando los resultados mientras se escribe. Se monta solo cuando está abierto.
 */
export default function Buscador({ combos, onCerrar }: { combos: Combo[]; onCerrar: () => void }) {
  const { productos } = useCart();
  const router = useRouter();
  const [consulta, setConsulta] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alTeclear);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  const resultados = useMemo(() => buscarEnCatalogo(consulta, productos, combos), [consulta, productos, combos]);
  const visibles = resultados.slice(0, MAX_RESULTADOS);
  const hrefDe = (r: (typeof resultados)[number]) => (r.tipo === "producto" ? `/producto/${r.item.slug}` : `/combos/${r.item.slug}`);
  const buscando = consulta.trim().length >= 2;

  return (
    <div className="search-root">
      <div className="search-overlay" onClick={onCerrar} aria-hidden="true"></div>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Buscar productos">
        <div className="wrap">
          <form
            className="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (visibles.length === 0) return;
              router.push(hrefDe(visibles[0]));
              onCerrar();
            }}
          >
            <Icon name="search" />
            <input
              ref={input}
              type="search"
              className="search-input"
              placeholder="Buscá por producto o ingrediente: cacao, aceite de coco…"
              aria-label="Buscar productos"
              autoComplete="off"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
            />
            <button type="button" className="drawer-close" onClick={onCerrar} aria-label="Cerrar buscador">
              <Icon name="close" />
            </button>
          </form>

          <div aria-live="polite">
            {buscando && visibles.length === 0 && (
              <p className="search-empty">No encontramos nada para “{consulta.trim()}”. Probá con otra palabra.</p>
            )}
            {visibles.length > 0 && (
              <ul className="search-results">
                {visibles.map((r) => {
                  const foto = r.item.imagenes?.[0];
                  return (
                    <li className="drawer-item" key={`${r.tipo}-${r.item.slug}`}>
                      <Link href={hrefDe(r)} className="drawer-item-media" onClick={onCerrar} tabIndex={-1} aria-hidden="true">
                        {foto && <Image src={foto.url} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
                      </Link>
                      <div className="drawer-item-info">
                        {r.tipo === "combo" && <span className="cart-item-tag">Combo</span>}
                        <Link href={hrefDe(r)} className="drawer-item-name" onClick={onCerrar}>{r.item.nombre}</Link>
                        <span className="price">{formatPrecio(r.item.precio)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {resultados.length > MAX_RESULTADOS && (
              <p className="search-more">Hay {resultados.length - MAX_RESULTADOS} más — sumá otra palabra para afinar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
