import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/Themes-provider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

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