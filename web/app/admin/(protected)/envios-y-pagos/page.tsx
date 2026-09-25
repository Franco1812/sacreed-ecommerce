import { adminApiFetch } from "@/lib/admin-api";
import EditorTextos from "../textos/EditorTextos";
import type { CampoTexto, GrupoTexto } from "../textos/campos";

export default async function AdminEnviosYPagosPage() {
  const res = await adminApiFetch("/contenido/textos/campos");
  if (!res.ok) throw new Error(`GET /contenido/textos/campos: ${res.status}`);
  const { grupos, campos }: { grupos: GrupoTexto[]; campos: CampoTexto[] } = await res.json();
  const gruposEnvios = grupos.filter((g) => g.pantalla === "envios");

  return (
    <div className="ce-root">
      <div className="admin-main-head">
        <h1>Envíos y pagos</h1>
      </div>
      <p className="ce-intro">
        Cuánto cuesta el envío, desde qué monto es gratis, qué barrios entran en el reparto propio y a qué cuenta transfieren tus clientes.
        Los montos y los barrios son los mismos que se usan para cobrar el pedido.
      </p>
      <EditorTextos grupos={gruposEnvios} campos={campos.filter((c) => gruposEnvios.some((g) => g.id === c.grupo))} />
    </div>
  );
}
