import axios from 'axios';
import { env } from '@/config/env';
import { ApiError } from './api-error';

/** Single, pre-configured HTTP client used by every feature `api/` module. */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Request interceptor: the place to attach auth tokens later.
http.interceptors.request.use((config) => config);

// Response interceptor: normalise every failure into an ApiError.
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(ApiError.from(error)),
);
