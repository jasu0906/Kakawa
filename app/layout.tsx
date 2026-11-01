import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAKAWA — El origen de lo extraordinario",
  description: "Una historia que nace en la tierra venezolana y se transforma en una experiencia única. Cacao venezolano.",
  openGraph: {
    title: "KAKAWA — El origen de lo extraordinario",
    description: "Una experiencia inmersiva en el universo del cacao venezolano.",
    type: "website",
    locale: "es_VE",
  },
};

export const viewport: Viewport = {
  themeColor: "#140b07",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
