import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/api.types';

/** Normalised error thrown by every API call. */
export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(message: string, status = 0, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError<ApiErrorBody>(error)) {
      if (!error.response) {
        return new ApiError('Network error — please check your connection.');
      }
      const { status, data } = error.response;
      const raw = data?.message;
      const details = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return new ApiError(details[0] ?? error.message, status, details);
    }

    return new ApiError(error instanceof Error ? error.message : 'Unexpected error');
  }
}
