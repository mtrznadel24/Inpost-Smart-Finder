import { useQuery } from '@tanstack/react-query';
import { getLocker } from '../api/getLocker';
import { lockerKeys } from '@/features/lockers/queryKeys.ts';

export function useLocker(id: number | null) {
  return useQuery({
    queryKey: lockerKeys.detail(id!),
    queryFn: () => getLocker(id!),
    enabled: !!id,
  });
}