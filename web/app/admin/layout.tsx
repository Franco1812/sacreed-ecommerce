import type { Metadata } from "next";
import { Courier_Prime, Instrument_Sans } from "next/font/google";
import "./admin.css";

// Misma familia que el storefront.
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

// Solo para las vistas previas: es la segunda voz del storefront (descripciones, etiquetas).
const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Admin — SACRED",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${sans.variable} ${mono.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
