import { apiClient } from '@/api/client';
import type {Locker, LockerFiltersState, MapBounds} from '../types';

export async function getLockers(bounds: MapBounds | null, filters: LockerFiltersState): Promise<Locker[]> {
  if (!bounds) return [];

  const { data } = await apiClient.get<Locker[]>('lockers/in-scope', {
    params: {
      min_lat: bounds._southWest.lat,
      max_lat: bounds._northEast.lat,
      min_lon: bounds._southWest.lng,
      max_lon: bounds._northEast.lng,
      limit: 500,
      is_24_7: filters.is_24_7 ? true : undefined,
      payment_available: filters.payment_available ? true : undefined,
      easy_access_zone: filters.easy_access_zone ? true : undefined,
      physical_type: filters.physical_type,
    },
  });

  return data;
}