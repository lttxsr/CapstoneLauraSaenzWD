import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";

export const metadata = {
  title: "Biblioteca Universitaria",
  description: "SPA para explorar y gestionar libros",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Suspense fallback={<div className="p-4 text-center">Cargando encabezado...</div>}>
            <Header />
          </Suspense>

          <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
            <main className="container-page main-content">{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
