import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ui/Themes-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import QueryProvider from "@/providers/QueryProviders";
import { BRAND } from "@/shared/config/brand";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  applicationName: BRAND.productName,
  title: {
    default: `${BRAND.productName} | Gestion de ventas e inventario`,
    template: `%s | ${BRAND.productName}`,
  },
  description: BRAND.description,
  keywords: [
    "Crisal",
    "gestion de ventas",
    "control de inventario",
    "gestion de clientes",
    "dashboard comercial",
    "sistema para distribuidores",
  ],
  authors: [{ name: "Juan Guillermo Moreno Galvez" }],
  creator: "Juan Guillermo Moreno Galvez",
  publisher: BRAND.productName,
  category: "business software",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: BRAND.productName,
    title: `${BRAND.productName} | Gestion de ventas e inventario`,
    description: BRAND.description,
    images: [
      {
        url: BRAND.heroImage,
        width: 1680,
        height: 945,
        alt: "Crisal, sistema de gestion comercial con identidad de mariposa morfo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.productName} | Gestion de ventas e inventario`,
    description: BRAND.description,
    images: [BRAND.heroImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: BRAND.logo, type: "image/svg+xml" },
    ],
    shortcut: BRAND.logo,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            {children}
            <Toaster richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
