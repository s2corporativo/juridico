import type { Metadata } from "next";
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
  icons: {
    icon: "/icon-256.png",
    apple: "/icon-256.png",
  },
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
