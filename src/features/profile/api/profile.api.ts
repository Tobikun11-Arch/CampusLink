import {apiClient} from '../../../shared/api/client';

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  campus: string;
  course?: string | null;
  yearLevel?: string | null;
  bio?: string | null;
  interests?: string[] | null;
};

export async function getMe() {
  const res = await apiClient.get('/api/profiles/me');
  return res.data as Profile;
}
