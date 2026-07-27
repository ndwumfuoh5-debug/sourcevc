import axios from 'axios';
import useSWR, { mutate } from 'swr';
import type {
  PitchSubmission,
  PitchSubmissionCreate,
  PitchSubmissionUpdate,
} from '@/shared/models/pitch-submission';

export const apiClient = axios.create({
  baseURL: '/api',
});

const fetcher = <T>(url: string) => apiClient.get<T>(url).then((res) => res.data);

// ─── Submissions ────────────────────────────────────────────────────────────

export interface SubmissionFilters {
  status?: string;
  stage?: string;
  industry?: string;
  arr?: string;
}

export function buildSubmissionsKey(filters?: SubmissionFilters): string {
  if (!filters) return '/submissions';
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.stage) params.set('stage', filters.stage);
  if (filters.industry) params.set('industry', filters.industry);
  if (filters.arr) params.set('arr', filters.arr);
  const qs = params.toString();
  return qs ? `/submissions?${qs}` : '/submissions';
}

export function useSubmissions(filters?: SubmissionFilters) {
  return useSWR<PitchSubmission[], Error>(buildSubmissionsKey(filters), fetcher);
}

export async function createSubmission(data: PitchSubmissionCreate): Promise<PitchSubmission> {
  const res = await apiClient.post<PitchSubmission>('/submissions', data);
  // Revalidate all submission caches (any filter combination)
  await mutate((key) => typeof key === 'string' && key.startsWith('/submissions'));
  return res.data;
}

export async function updateSubmissionStatus(
  id: string,
  update: PitchSubmissionUpdate,
): Promise<PitchSubmission> {
  let result: PitchSubmission | undefined;

  await mutate(
    (key) => typeof key === 'string' && key.startsWith('/submissions'),
    async (current: PitchSubmission[] | undefined) => {
      const res = await apiClient.patch<PitchSubmission>(`/submissions/${id}`, update);
      result = res.data;
      return (current ?? []).map((s) => (s.id === id ? res.data : s));
    },
    {
      optimisticData: (current: PitchSubmission[] | undefined) =>
        (current ?? []).map((s) => (s.id === id ? { ...s, ...update } : s)),
      rollbackOnError: true,
      revalidate: false,
    },
  );

  if (!result) throw new Error('Update failed');
  return result;
}

export async function deleteSubmission(id: string): Promise<void> {
  await mutate(
    (key) => typeof key === 'string' && key.startsWith('/submissions'),
    async (current: PitchSubmission[] | undefined) => {
      await apiClient.delete(`/submissions/${id}`);
      return (current ?? []).filter((s) => s.id !== id);
    },
    {
      optimisticData: (current: PitchSubmission[] | undefined) =>
        (current ?? []).filter((s) => s.id !== id),
      rollbackOnError: true,
      revalidate: false,
    },
  );
}
