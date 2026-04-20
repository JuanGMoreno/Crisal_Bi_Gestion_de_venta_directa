"use client";

import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http";

type AuthMeUser = {
  id: string;
  email: string;
};

type AuthMeResponse = {
  message: string;
  user?: AuthMeUser;
};

export function useAuthSession() {
  const query = useQuery<AuthMeResponse>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await http.get<AuthMeResponse>("/auth/me");
      return response.data;
    },
    retry: 2,
    retryDelay: 400,
    staleTime: 60_000,
    refetchOnMount: "always",
  });

  return {
    ...query,
    user: query.data?.user ?? null,
    isAuthenticated: Boolean(query.data?.user),
  };
}
