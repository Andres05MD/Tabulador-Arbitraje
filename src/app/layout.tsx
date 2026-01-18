import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import MainLayout from "@/components/MainLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabulador de Arbitraje - Voleybol",
  description: "Sistema de gestión y cálculo de tabuladores de arbitraje para juegos de voleybol",
  keywords: ["voleybol", "arbitraje", "tabulador", "gestión deportiva"],
};

import { CourtProvider } from "@/components/CourtProvider";

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
            <CourtProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </CourtProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
