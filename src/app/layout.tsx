import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ejc/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jurimetria DPT — De Paula Teixeira Advocacia",
  description:
    "Plataforma de Jurimetria e Inteligência Jurídica da De Paula Teixeira Advocacia: compêndio de legislação, jurisprudência, teses, peças, contratos, checklists, fluxos e prazos com RAG rastreável até a fonte oficial, atualização diária por APIs públicas e foco em Minas Gerais.",
  keywords: [
    "Jurimetria DPT", "inteligência jurídica", "RAG jurídico", "jurisprudência", "legislação", "teses",
    "De Paula Teixeira Advocacia", "Minas Gerais", "juizados especiais", "direito tributário MG",
  ],
  manifest: "/manifest.webmanifest",
  applicationName: "Jurimetria DPT",
  appleWebApp: {
    capable: true,
    title: "Jurimetria DPT",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

// PWA — cor de tema = verde institucional da marca (fundo do logotipo).
export const viewport: Viewport = {
  themeColor: "#17352c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
