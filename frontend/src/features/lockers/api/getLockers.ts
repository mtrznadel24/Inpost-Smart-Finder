import { apiClient } from '@/api/client';
import { Locker, MapBounds } from '../types';

export async function getLockers(bounds: MapBounds | null): Promise<Locker[]> {
  if (!bounds) return [];

  const { data } = await apiClient.get<Locker[]>('/in-scope', {
    params: {
      min_lat: bounds._southWest.lat,
      max_lat: bounds._northEast.lat,
      min_lon: bounds._southWest.lng,
      max_lon: bounds._northEast.lng,
      limit: 500
    },
  });

  return data;
}