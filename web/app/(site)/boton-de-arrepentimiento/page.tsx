import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";
import FormularioArrepentimiento from "./FormularioArrepentimiento";

export const generateMetadata = () => metadataPagina("boton-de-arrepentimiento");

export default function BotonArrepentimientoPage() {
  return (
    <PaginaTexto slug="boton-de-arrepentimiento">
      <FormularioArrepentimiento />
    </PaginaTexto>
  );
}
