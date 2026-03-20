import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ui/Themes-provider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/shared/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/ui/app-sidebar"
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
      <body className="antialiased overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-14 items-center border-b px-4">
                <SidebarTrigger />
              </header>
              <div className="flex min-w-0 flex-1 flex-col p-4">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}