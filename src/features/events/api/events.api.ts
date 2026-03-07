import {apiClient} from '../../../shared/api/client';

export type GetEventsParams = {
  campus?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  page?: number;
};

export type EventItem = {
  id: string;
  title?: string;
  description?: string;
  campus?: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  organizerName?: string;
  coverImageUrl?: string;
  attendingCount?: number;
  slotsTotal?: number;
};

export async function getEvents(params: GetEventsParams = {}) {
  const res = await apiClient.get('/api/events', {
    params: {
      ...params,
      limit: params.limit?.toString(),
      page: params.page?.toString()
    }
  });

  return res.data as EventItem[];
}
