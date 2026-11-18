/** Typed, defaulted access to build-time environment variables. */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  appName: import.meta.env.VITE_APP_NAME ?? 'Tasks',
  isDev: import.meta.env.DEV,
} as const;
