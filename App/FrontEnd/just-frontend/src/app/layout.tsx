import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ui/Themes-provider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/ui/app-sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "App con Sidebar",
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
         {children}
        </ThemeProvider>
      </body>
    </html>
  );
}