import { ProductoForm, type ProductoFormValues } from "../ProductoForm";
import { crearProducto } from "../../../actions";

const inicial: ProductoFormValues = {
  slug: "",
  nombre: "",
  formulaSubtitulo: "",
  linea: "",
  ritual: [],
  orden: "",
  momentoSugerido: "",
  descripcion: "",
  laFormula: [],
  beneficios: [],
  ritualDeUso: "",
  ingredientes: "",
  notaDePureza: "",
  origen: "",
  precio: "",
  formato: "",
  pesoNetoGramos: "",
  paqueteAltoCm: "",
  paqueteAnchoCm: "",
  paqueteProfundidadCm: "",
  stock: "0",
  destacado: "",
  nombrePendiente: false,
  seoTitulo: "",
  seoDescripcion: "",
};

export default function NuevoProductoPage() {
  return (
    <>
      <div className="admin-main-head">
        <h1>Nuevo producto</h1>
      </div>
      <ProductoForm initial={inicial} modoEdicion={false} onGuardar={crearProducto} />
    </>
  );
}
