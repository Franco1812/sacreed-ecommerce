import Link from "next/link";
import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("nuestro-origen");

export default function NuestroOrigenPage() {
  return (
    <PaginaTexto slug="nuestro-origen" variante="institucional">
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Link href="/comprar-por-beneficio" className="link-all">Ir a la tienda</Link>
      </div>
    </PaginaTexto>
  );
}
