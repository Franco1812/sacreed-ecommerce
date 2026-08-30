import { ComboForm, type ComboFormValues } from "../ComboForm";
import { crearCombo } from "../../../actions";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface ProductoResumen {
  slug: string;
  nombre: string;
}

async function getProductosDisponibles(): Promise<ProductoResumen[]> {
  const res = await fetch(`${API_URL}/productos`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /productos: ${res.status}`);
  return res.json();
}

const inicial: ComboFormValues = {
  slug: "",
  nombre: "",
  bajada: "",
  ritual: [],
  porQueSePotencian: "",
  copyAprobado: false,
  precio: "",
  stock: "0",
  productos: [],
};

export default async function NuevoComboPage() {
  const productosDisponibles = await getProductosDisponibles();

  return (
    <>
      <div className="admin-main-head">
        <h1>Nuevo combo</h1>
      </div>
      <ComboForm initial={inicial} modoEdicion={false} productosDisponibles={productosDisponibles} onGuardar={crearCombo} />
    </>
  );
}
