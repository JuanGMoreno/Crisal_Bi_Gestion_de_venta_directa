import { useCallback } from "react";
import { getApiErrorMessage } from "@/shared/api/error";
import { http } from "@/shared/api/http";
import { DistributorChild, DistributorProfile } from "../types/Profile";

export default function useProfileServices() {
  const getCurrentProfile = useCallback(async (): Promise<DistributorProfile> => {
    try {
      const response = await http.get("/distributors/me");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al obtener tu perfil."));
    }
  }, []);

  const renewReferralCode = useCallback(async (): Promise<DistributorProfile> => {
    try {
      const response = await http.post("/distributors/me/referral-code");
      return response.data.profile;
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, "No se pudo solicitar un nuevo codigo de referido.")
      );
    }
  }, []);

  const linkReferralCode = useCallback(async (codigoReferido: string): Promise<DistributorProfile> => {
    try {
      const response = await http.post("/distributors/me/link-referral", {
        codigo_referido: codigoReferido,
      });
      return response.data.profile;
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, "No se pudo vincular tu perfil con ese codigo.")
      );
    }
  }, []);

  const getCurrentChildren = useCallback(async (): Promise<DistributorChild[]> => {
    try {
      const response = await http.get("/distributors/me/children");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al obtener tu equipo."));
    }
  }, []);

  const updateCurrentProfile = useCallback(async (data: FormData): Promise<DistributorProfile> => {
    try {
      const response = await http.put("/distributors/me", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "No se pudo actualizar tu perfil."));
    }
  }, []);

  return {
    getCurrentProfile,
    renewReferralCode,
    linkReferralCode,
    getCurrentChildren,
    updateCurrentProfile,
  };
}
