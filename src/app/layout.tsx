import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "App pessoal para controle de entradas e saídas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
