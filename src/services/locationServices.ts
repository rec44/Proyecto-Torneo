const API_URL = 'http://localhost:3001';
import type { Comunidad, Provincia } from '../types/location';

export const locationService = {
  getComunidades: async (): Promise<Comunidad[]> => {
    const response = await fetch(`${API_URL}/comunidades`);
    if (!response.ok) throw new Error('Error al obtener comunidades');
    return response.json();
  },

  getProvincias: async (): Promise<Provincia[]> => {
    const response = await fetch(`${API_URL}/provincias`);
    if (!response.ok) throw new Error('Error al obtener provincias');
    return response.json();
  },

  getProvinciasByComunidad: async (comunidadCodigo: string): Promise<Provincia[]> => {
    const response = await fetch(`${API_URL}/provincias?comunidad=${comunidadCodigo}`);
    if (!response.ok) throw new Error('Error al obtener provincias por comunidad');
    return response.json();
  }
};