import { adminApiFetch } from "@/lib/admin-api";
import EditorTextos from "./EditorTextos";
import { valoresActuales, type RegistroTextos } from "./campos";

export default async function AdminTextosPage() {
  const res = await adminApiFetch("/contenido/textos/campos");
  if (!res.ok) throw new Error(`GET /contenido/textos/campos: ${res.status}`);
  const { grupos, campos }: RegistroTextos = await res.json();
  const gruposTienda = grupos.filter((g) => g.pantalla === "tienda");

  return (
    <div className="ce-root">
      <div className="admin-main-head">
        <h1>Tienda y compra</h1>
      </div>
      <p className="ce-intro">
        Los textos fijos que acompañan a los productos y a la compra: la ficha de producto, los combos, los rituales, el carrito, el checkout y el
        pedido confirmado. A la derecha ves cómo queda. Cuando termines, tocá «Guardar cambios».
      </p>
      <EditorTextos
        grupos={gruposTienda}
        campos={campos.filter((c) => gruposTienda.some((g) => g.id === c.grupo))}
        base={valoresActuales(campos)}
      />
    </div>
  );
}
