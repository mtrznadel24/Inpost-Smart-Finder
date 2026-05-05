import type {LockerFiltersState, MapBounds} from './types';

export const lockerKeys = {
  all: ['lockers'] as const,
  list: (bounds: MapBounds | null, filters: LockerFiltersState) =>
    [...lockerKeys.all, bounds, filters] as const,
  details: () => [...lockerKeys.all, 'detail'] as const,
  detail: (id: number) => [...lockerKeys.details(), id] as const,
};