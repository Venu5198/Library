export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  appName: import.meta.env.VITE_APP_NAME ?? "MyPlatform",
  appVersion: import.meta.env.VITE_APP_VERSION ?? "1.0.0",
} as const;
