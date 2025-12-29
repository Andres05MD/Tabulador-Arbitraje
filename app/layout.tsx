import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { AuthProvider } from "@/src/components/AuthProvider";
import MainLayout from "@/src/components/MainLayout";

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
      <body className={`${inter.className} antialiased min-h-screen selection:bg-primary-500 selection:text-white`}>
        <ThemeProvider>
          <AuthProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
