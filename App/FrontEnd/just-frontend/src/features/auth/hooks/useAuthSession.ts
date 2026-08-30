"use client";

import { useContext } from "react";
import { AuthSessionContext } from "@/features/auth/providers/AuthSessionProvider";

export function useAuthSession() {
  const session = useContext(AuthSessionContext);

  if (!session) {
    throw new Error("useAuthSession debe utilizarse dentro de AuthSessionProvider.");
  }

  return session;
}
