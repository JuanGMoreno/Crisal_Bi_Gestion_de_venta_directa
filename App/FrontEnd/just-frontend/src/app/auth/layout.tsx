"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/shared/api/authTokens";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token) {
      router.replace("/system");
      return;
    }

    setCanRender(true);
  }, [router]);

  if (!canRender) {
    return null;
  }

  return <>{children}</>;
}
