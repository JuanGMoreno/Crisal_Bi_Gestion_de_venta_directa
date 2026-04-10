"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/ui/app-sidebar";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isError } = useAuthSession();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/auth/signin");
    }
  }, [isError, isLoading, router, user]);

  if (isLoading || isError || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex min-w-0 flex-1 flex-col p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
