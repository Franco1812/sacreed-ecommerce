import Link from "next/link";
import { actualizarProducto } from "../../actions";

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const STOCK_BAJO_UMBRAL = 5;

interface ProductoAdmin {
  slug: string;
  nombre: string;
  linea: string;
  precio: number;
  stock: number;
}

async function getProductos(): Promise<ProductoAdmin[]> {
  const res = await fetch(`${API_URL}/productos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /productos: ${res.status}`);
  return res.json();
}

async function guardar(slug: string, formData: FormData) {
  "use server";
  const precio = Number(formData.get("precio"));
  const stock = Number(formData.get("stock"));
  await actualizarProducto(slug, { precio, stock });
}

export default async function AdminProductosPage() {
  const productos = await getProductos();

  return (
    <>
      <div className="admin-main-head">
        <h1>Productos</h1>
        <Link href="/admin/productos/nuevo" className="admin-btn">Nuevo producto</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Línea</th>
            <th>Precio</th>
            <th>Stock</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const formId = `producto-${p.slug}`;
            return (
              <tr key={p.slug} className={p.stock <= STOCK_BAJO_UMBRAL ? "admin-stock-bajo" : undefined}>
                <td>{p.nombre}</td>
                <td>{p.linea}</td>
                <td>
                  <input form={formId} type="number" name="precio" defaultValue={p.precio} min={0} />
                </td>
                <td>
                  <input form={formId} type="number" name="stock" defaultValue={p.stock} min={0} />
                </td>
                <td>
                  <form id={formId} action={guardar.bind(null, p.slug)} />
                  <button form={formId} type="submit" className="admin-btn-ghost">Guardar</button>
                </td>
                <td>
                  <Link href={`/admin/productos/${p.slug}/editar`} className="admin-btn-ghost">Editar</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
