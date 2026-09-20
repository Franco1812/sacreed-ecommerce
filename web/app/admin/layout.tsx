import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./admin.css";

// Misma familia que el storefront.
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

// Solo para la vista previa de la portada en /admin/contenido: es la serif de los títulos del storefront.
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Admin — SACRED",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${sans.variable} ${serif.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
