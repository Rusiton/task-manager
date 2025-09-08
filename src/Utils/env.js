// Helper functions to safely get environment variables

/**
 * Get string environment variable with fallback
 */
export const getEnvString = (key, fallback = '') => {
  return import.meta.env[key] || fallback;
};

/**
 * Get boolean environment variable
 */
export const getEnvBoolean = (key, fallback = false) => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
};

/**
 * Get number environment variable
 */
export const getEnvNumber = (key, fallback = 0) => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Get API configuration from environment
 */
export const getApiConfigFromEnv = () => {
  const isDev = import.meta.env.DEV;
  
  return {
    baseURL: getEnvString('VITE_API_URL', isDev ? 'http://localhost:8000/api' : '/api'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', isDev ? 10000 : 5000),
    debug: getEnvBoolean('VITE_DEBUG', isDev),
    retries: getEnvNumber('VITE_API_RETRIES', isDev ? 3 : 1),
    enableLogging: getEnvBoolean('VITE_ENABLE_LOGGING', isDev),
    environment: import.meta.env.MODE,
    isDevelopment: isDev,
    isProduction: import.meta.env.PROD
  };
};

/**
 * Validate required environment variables
 */
export const validateEnvConfig = (requiredVars = []) => {
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};