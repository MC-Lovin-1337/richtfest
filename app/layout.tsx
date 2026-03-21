import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mein Next.js Projekt",
  description: "Erstellt mit Next.js 14/15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning verhindert den Fehler durch Browser-Erweiterungen
    <html lang="de" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  );
}
