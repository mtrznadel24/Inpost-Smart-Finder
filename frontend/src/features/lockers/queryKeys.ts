import type { MapBounds } from './types';

export const lockerKeys = {
  all: ['lockers'] as const,
  list: (bounds: MapBounds | null) => [...lockerKeys.all, 'list', bounds] as const,
  detail: (id: number) => [...lockerKeys.all, 'detail', id] as const,
};