/**
 * Centralized Environment Configuration Loader
 */

interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
}

export const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  appName: import.meta.env.VITE_APP_NAME || 'FinTrack',
  appEnv: (import.meta.env.VITE_APP_ENV as EnvConfig['appEnv']) || 'development',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

export default env;
