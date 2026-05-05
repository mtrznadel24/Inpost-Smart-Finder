import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getLockers } from '../api/getLockers';
import type {LockerFiltersState, MapBounds} from '../types';
import {lockerKeys} from "@/features/lockers/queryKeys.ts";

export function useLockers(bounds: MapBounds | null, filters: LockerFiltersState) {
  return useQuery({
    queryKey: lockerKeys.list(bounds, filters),
    queryFn: () => getLockers(bounds, filters),
    enabled: !!bounds,
    placeholderData: keepPreviousData,
  });
}