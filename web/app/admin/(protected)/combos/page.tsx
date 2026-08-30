import Link from "next/link";
import { actualizarCombo } from "../../actions";

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const STOCK_BAJO_UMBRAL = 5;

interface ComboAdmin {
  slug: string;
  nombre: string;
  precio: number;
  stock: number;
}

async function getCombos(): Promise<ComboAdmin[]> {
  const res = await fetch(`${API_URL}/combos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /combos: ${res.status}`);
  return res.json();
}

async function guardar(slug: string, formData: FormData) {
  "use server";
  const precio = Number(formData.get("precio"));
  const stock = Number(formData.get("stock"));
  await actualizarCombo(slug, { precio, stock });
}

export default async function AdminCombosPage() {
  const combos = await getCombos();

  return (
    <>
      <div className="admin-main-head">
        <h1>Combos</h1>
        <Link href="/admin/combos/nuevo" className="admin-btn">Nuevo combo</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Combo</th>
            <th>Precio</th>
            <th>Stock</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {combos.map((c) => {
            const formId = `combo-${c.slug}`;
            return (
              <tr key={c.slug} className={c.stock <= STOCK_BAJO_UMBRAL ? "admin-stock-bajo" : undefined}>
                <td>{c.nombre}</td>
                <td>
                  <input form={formId} type="number" name="precio" defaultValue={c.precio} min={0} />
                </td>
                <td>
                  <input form={formId} type="number" name="stock" defaultValue={c.stock} min={0} />
                </td>
                <td>
                  <form id={formId} action={guardar.bind(null, c.slug)} />
                  <button form={formId} type="submit" className="admin-btn-ghost">Guardar</button>
                </td>
                <td>
                  <Link href={`/admin/combos/${c.slug}/editar`} className="admin-btn-ghost">Editar</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
