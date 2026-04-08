import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ui/Themes-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import QueryProvider from "@/providers/QueryProviders";

export const metadata: Metadata = {
  title: "JustMannager",
  description: "Sistema de Gestion Just",
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