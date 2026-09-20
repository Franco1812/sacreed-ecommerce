import Link from "next/link";
import ProductosLista, { type ProductoFila } from "./ProductosLista";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface ProductoApi {
  slug: string;
  nombre: string;
  linea: string;
  ritual: string[];
  precio: number;
  stock: number;
  imagenes: { url: string }[];
}

async function getProductos(): Promise<ProductoFila[]> {
  const res = await fetch(`${API_URL}/productos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /productos: ${res.status}`);
  const rows: ProductoApi[] = await res.json();
  return rows.map(({ slug, nombre, linea, ritual, precio, stock, imagenes }) => ({
    slug,
    nombre,
    linea,
    ritual,
    precio,
    stock,
    foto: imagenes[0]?.url,
  }));
}

export default async function AdminProductosPage() {
  const productos = await getProductos();

  return (
    <>
      <div className="admin-main-head">
        <h1>Productos</h1>
        <Link href="/admin/productos/nuevo" className="admin-btn">Nuevo producto</Link>
      </div>
      <ProductosLista productos={productos} />
    </>
  );
}
