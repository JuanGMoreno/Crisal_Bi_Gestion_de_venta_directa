import { useCallback } from 'react';
import { getApiErrorMessage } from '@/shared/api/error';
import { http } from '@/shared/api/http';
import { DistributorProfile } from '../types/Profile';

export default function useProfileServices() {
  const getCurrentProfile = useCallback(async (): Promise<DistributorProfile> => {
    try {
      const response = await http.get('/distributors/me');
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Error al obtener tu perfil.'));
    }
  }, []);

  const updateCurrentProfile = useCallback(async (data: FormData): Promise<DistributorProfile> => {
    try {
      const response = await http.put('/distributors/me', data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo actualizar tu perfil.'));
    }
  }, []);

  return { getCurrentProfile, updateCurrentProfile };
}
