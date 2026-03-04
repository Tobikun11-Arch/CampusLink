import axios from 'axios';

import {authStore} from '../stores/auth.store';

const api_url = process.env.EXPO_PUBLIC_API_URL;

if (!api_url) {
  throw new Error('Missing api url environment variables');
}

export const apiClient = axios.create({
  baseURL: api_url
});

apiClient.interceptors.request.use(config => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
