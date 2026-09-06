// Determine default API base URL
const getDefaultBaseURL = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    // If running in browser, default to current origin (works on Cloud Run & local dev)
    // If custom VITE_API_URL is configured, use that
    return (import.meta as any).env?.VITE_API_URL || window.location.origin;
  }
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
};

const getDefaultWsURL = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    if ((import.meta as any).env?.VITE_WS_URL) {
      return (import.meta as any).env.VITE_WS_URL;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }
  return (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3000';
};

export const API_CONFIG = {
  baseURL: getDefaultBaseURL(),
  wsURL: getDefaultWsURL(),
  timeout: 30000,
};

export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Ensure we don't end up with double slashes if baseURL ends with '/'
  const base = API_CONFIG.baseURL.endsWith('/') ? API_CONFIG.baseURL.slice(0, -1) : API_CONFIG.baseURL;
  return `${base}${cleanEndpoint}`;
};

export const getWsUrl = (path: string = '') => {
  const cleanPath = path && !path.startsWith('/') ? `/${path}` : path;
  const base = API_CONFIG.wsURL.endsWith('/') ? API_CONFIG.wsURL.slice(0, -1) : API_CONFIG.wsURL;
  return `${base}${cleanPath}`;
};

export const fetchWithConfig = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = getApiUrl(endpoint);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};
