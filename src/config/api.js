const createApiConfig = () => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  
  return {
    // Base URL with fallbacks
    baseURL: import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:8000/api' : '/api'),
    
    // Timeout based on environment
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || (isDev ? 10000 : 5000),
    
    // Debug mode
    debug: import.meta.env.VITE_DEBUG === 'true' || isDev,
    
    // Environment info
    environment: import.meta.env.MODE,
    isDevelopment: isDev,
    isProduction: isProd,
    
    // Additional config
    retries: parseInt(import.meta.env.VITE_API_RETRIES) || (isDev ? 3 : 1),
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true' || isDev,
  };
};

export default createApiConfig();