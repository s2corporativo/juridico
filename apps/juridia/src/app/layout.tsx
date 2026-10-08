import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Jurídico — Inteligência e Automação Jurídica",
  description:
    "Sistema interno do escritório para análise, pesquisa, redação, evidências e revisão jurídica assistida por IA.",
  keywords: [
    "IA jurídica",
    "minuta",
    "petição",
    "sentença",
    "Direito brasileiro",
    "LGPD",
    "CNJ 615/2025",
    "jurisprudência",
  ],
  authors: [{ name: "Atlas Jurídico" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Atlas Jurídico — Inteligência Jurídica",
    description:
      "Sistema interno de inteligência jurídica com rastreabilidade de evidências, pesquisa e revisão humana.",
    siteName: "Atlas Jurídico",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
