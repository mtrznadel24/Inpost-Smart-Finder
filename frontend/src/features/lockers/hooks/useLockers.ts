import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getLockers } from '../api/getLockers';
import { MapBounds } from '../types';
import {lockerKeys} from "@/features/lockers/queryKeys.ts";

export function useLockers(bounds: MapBounds | null) {
  return useQuery({
    queryKey: lockerKeys.list(bounds),
    queryFn: () => getLockers(bounds),
    enabled: !!bounds,
    placeholderData: keepPreviousData,
  });
}