import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./admin.css";

// Misma familia que el storefront.
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Admin — SACRED",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={sans.variable}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
