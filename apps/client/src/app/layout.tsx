import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Biblioteca Universitaria",
  description: "SPA para explorar y gestionar libros",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Header />
          <main className="container-page main-content">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
