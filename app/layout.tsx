import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { AuthProvider } from "@/src/components/AuthProvider";
import Navigation from "@/src/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabulador de Arbitraje - Voleybol",
  description: "Sistema de gestión y cálculo de tabuladores de arbitraje para juegos de voleybol",
  keywords: ["voleybol", "arbitraje", "tabulador", "gestión deportiva"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <Navigation />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

