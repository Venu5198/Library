/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
declare const __UI_LIB_VERSION__: string;
declare const __DEPENDENCIES__: Record<string, string>;
declare const __DEV_DEPENDENCIES__: Record<string, string>;
declare const __BUILD_TIMESTAMP__: string;
