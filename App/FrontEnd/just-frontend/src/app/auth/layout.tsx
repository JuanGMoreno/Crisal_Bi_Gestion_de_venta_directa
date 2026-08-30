"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionLoadingScreen } from "@/features/auth/components/sessionLoadingScreen/SessionLoadingScreen";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isError } = useAuthSession();

  useEffect(() => {
    if (!isLoading && !isError && user) {
      router.replace("/system");
    }
  }, [isError, isLoading, router, user]);

  if (isLoading) {
    return <SessionLoadingScreen />;
  }

  if (!isError && user) {
    return null;
  }

  return <>{children}</>;
}
