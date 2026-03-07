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
  followers?: number | null;
  following?: number | null;
  badges?: any[] | null;
  contributionScore?: number | null;
  globalRank?: number | null;
  reputationScore?: number | null;
};

export type UpdateMeInput = {
  course?: string;
  yearLevel?: string;
  bio?: string;
  interests?: string[];
};

export async function getMe() {
  try {
    const res = await apiClient.get('/api/profiles/me');
    console.log('getMe raw response:', res.data);
    return res.data as Profile;
  } catch (err: any) {
    console.log('getMe error:', err.response?.status, err.response?.data);
    throw err;
  }
}

export async function updateMe(input: UpdateMeInput) {
  const res = await apiClient.patch('/api/profiles/me', input);
  return res.data as {message: string};
}
