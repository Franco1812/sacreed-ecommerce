"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { actualizarProducto } from "../../actions";

export interface ProductoFila {
  slug: string;
  nombre: string;
  linea: string;
  ritual: string[];
  precio: number;
  stock: number;
  foto?: string;
}

const STOCK_BAJO_UMBRAL = 5;

const LINEAS: Record<string, string> = {
  FOCO_VITALIDAD: "Foco & Vitalidad",
  LONGEVIDAD_GLOW: "Longevidad & Glow",
  SALUD_INTESTINAL: "Salud Intestinal",
  CALMA_ALQUIMICA: "Calma Alquímica",
};

function normalizar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function Fila({ producto }: { producto: ProductoFila }) {
  const [precio, setPrecio] = useState(String(producto.precio));
  const [stock, setStock] = useState(String(producto.stock));
  const [guardado, setGuardado] = useState({ precio: producto.precio, stock: producto.stock });
  const [pending, startTransition] = useTransition();
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");

  const precioNum = Number(precio);
  const stockNum = Number(stock);
  const valido = precio.trim() !== "" && stock.trim() !== "" && Number.isInteger(precioNum) && Number.isInteger(stockNum) && precioNum >= 0 && stockNum >= 0;
  const cambiado = precioNum !== guardado.precio || stockNum !== guardado.stock;

  const sinStock = guardado.stock <= 0;
  const stockBajo = !sinStock && guardado.stock <= STOCK_BAJO_UMBRAL;

  function guardar() {
    startTransition(async () => {
      const res = await actualizarProducto(producto.slug, { precio: precioNum, stock: stockNum });
      if (res.ok) {
        setGuardado({ precio: precioNum, stock: stockNum });
        setEstado("ok");
      } else {
        setEstado("error");
      }
    });
  }

  return (
    <li className="pl-fila">
      <div className="pl-foto">
        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de admin */}
        {producto.foto ? <img src={producto.foto} alt="" /> : <span>Sin foto</span>}
      </div>

      <div className="pl-info">
        <Link href={`/admin/productos/${producto.slug}/editar`} className="pl-nombre">{producto.nombre}</Link>
        <span className="pl-meta">
          {LINEAS[producto.linea] ?? producto.linea}
          {producto.ritual.length > 0 && ` · ${producto.ritual.map((r) => r.toUpperCase()).join(" / ")}`}
        </span>
        {sinStock && <span className="pl-tag pl-tag-alerta">Sin stock</span>}
        {stockBajo && <span className="pl-tag pl-tag-aviso">Stock bajo</span>}
      </div>

      <label className="pl-campo">
        <span>Precio ($)</span>
        <input type="number" min={0} inputMode="numeric" value={precio} onChange={(e) => { setPrecio(e.target.value); setEstado("idle"); }} />
      </label>
      <label className="pl-campo">
        <span>Stock</span>
        <input type="number" min={0} inputMode="numeric" value={stock} onChange={(e) => { setStock(e.target.value); setEstado("idle"); }} />
      </label>

      <div className="pl-acciones">
        {cambiado ? (
          <button type="button" className="admin-btn pl-guardar" onClick={guardar} disabled={pending || !valido}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
        ) : (
          estado === "ok" && <span className="pl-ok" role="status">✓ Guardado</span>
        )}
        {estado === "error" && <span className="pl-error" role="alert">No se pudo guardar</span>}
        <Link href={`/admin/productos/${producto.slug}/editar`} className="admin-btn-ghost pl-editar">Editar</Link>
      </div>
    </li>
  );
}

export default function ProductosLista({ productos }: { productos: ProductoFila[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [linea, setLinea] = useState("");
  const [soloAtencion, setSoloAtencion] = useState(false);

  const sinFoto = productos.filter((p) => !p.foto).length;
  const conAtencion = productos.filter((p) => p.stock <= STOCK_BAJO_UMBRAL).length;

  const q = normalizar(busqueda.trim());
  const visibles = productos.filter(
    (p) =>
      (!q || normalizar(p.nombre).includes(q)) &&
      (!linea || p.linea === linea) &&
      (!soloAtencion || p.stock <= STOCK_BAJO_UMBRAL)
  );

  return (
    <>
      <div className="pl-toolbar">
        <input
          type="search"
          className="pl-buscar"
          placeholder="Buscar producto…"
          aria-label="Buscar producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select aria-label="Filtrar por línea" value={linea} onChange={(e) => setLinea(e.target.value)}>
          <option value="">Todas las líneas</option>
          {Object.entries(LINEAS).map(([valor, label]) => (
            <option key={valor} value={valor}>{label}</option>
          ))}
        </select>
        <label className="pl-check">
          <input type="checkbox" checked={soloAtencion} onChange={(e) => setSoloAtencion(e.target.checked)} />
          Solo con poco stock ({conAtencion})
        </label>
      </div>

      <p className="pl-resumen">
        {visibles.length === productos.length ? `${productos.length} productos` : `${visibles.length} de ${productos.length} productos`}
        {sinFoto > 0 && <span className="pl-resumen-aviso"> · {sinFoto} sin foto</span>}
      </p>

      {visibles.length === 0 ? (
        <p className="ce-vacio">No hay productos que coincidan con la búsqueda.</p>
      ) : (
        <ul className="pl-lista">
          {visibles.map((p) => (
            <Fila key={p.slug} producto={p} />
          ))}
        </ul>
      )}
    </>
  );
}
