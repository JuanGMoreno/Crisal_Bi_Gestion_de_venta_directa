"use client";

import axios from "axios";
import { createContext, useCallback, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthMeResponse, AuthMeUser } from "@/features/auth/types/authTypes";
import { http } from "@/shared/api/http";

const AUTH_SESSION_QUERY_KEY = ["auth", "me"] as const;
const AUTH_SESSION_STALE_TIME = 5 * 60 * 1000;

type AuthSessionContextValue = {
  user: AuthMeUser | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  setSession: (session: AuthMeResponse) => void;
  clearSession: () => void;
};

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const query = useQuery<AuthMeResponse>({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: async () => {
      try {
        // Render puede necesitar varios segundos para reactivar una instancia
        // gratuita. Una sola espera larga evita peticiones duplicadas.
        const response = await http.get<AuthMeResponse>("/auth/me", { timeout: 60_000 });
        return response.data;
      } catch (error: unknown) {
        // No tener una sesión es un estado esperado en las rutas públicas,
        // no un fallo que deba reintentarse o dejar la consulta en error.
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return { message: "No existe una sesión activa." };
        }

        throw error;
      }
    },
    retry: false,
    staleTime: AUTH_SESSION_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const setSession = useCallback(
    (session: AuthMeResponse) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
    },
    [queryClient]
  );

  const clearSession = useCallback(() => {
    queryClient.setQueryData<AuthMeResponse>(AUTH_SESSION_QUERY_KEY, {
      message: "Sesión cerrada.",
    });
  }, [queryClient]);

  const value = useMemo<AuthSessionContextValue>(() => {
    const user = query.data?.user ?? null;

    return {
      user,
      isLoading: query.isLoading,
      isError: query.isError,
      isAuthenticated: Boolean(user),
      setSession,
      clearSession,
    };
  }, [clearSession, query.data?.user, query.isError, query.isLoading, setSession]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}
