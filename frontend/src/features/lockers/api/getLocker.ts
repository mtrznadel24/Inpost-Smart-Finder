import { apiClient } from '@/api/client';
import { LockerDetails } from '../types';

export async function getLocker(id: number): Promise<LockerDetails> {
  const { data } = await apiClient.get<LockerDetails>(`/lockers/${id}`);
  return data;
}