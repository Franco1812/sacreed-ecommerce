import type { Metadata } from "next";
import { Instrument_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { getAllCombos, getAllProductos, getLineas } from "@/lib/data";
import { productosMasVendidos } from "@/lib/helpers";

// Dos voces, como en la referencia (Moon Juice): sans grotesca para todo lo estructural
// (títulos, nav, cuerpo) y mono tipo máquina de escribir para descripciones, atributos y etiquetas.
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SACRED Wellness Club",
  description: "Alacena funcional · Buenos Aires",
};

// El catálogo vive en una base real vía la API — no tiene sentido pre-renderizar
// en build time (ni siquiera es posible: la API no está levantada durante el build).
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [productos, combos, lineas, masVendidos] = await Promise.all([
    getAllProductos(),
    getAllCombos(),
    getLineas(),
    productosMasVendidos(),
  ]);

  return (
    <html lang="es-AR" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <CartProvider productos={productos} combos={combos}>
          <Header lineas={lineas} combos={combos} masVendidos={masVendidos.map((m) => m.producto)} />
          {children}
          <Footer lineas={lineas} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
