/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the REST API (defaults to `/api/v1`, proxied in dev and by nginx in prod) */
  readonly VITE_API_BASE_URL?: string;
  /** Application display name */
  readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
