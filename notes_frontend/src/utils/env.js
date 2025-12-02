const RAW = {
  API_BASE: process.env.REACT_APP_API_BASE,
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL
};

/**
 * PUBLIC_INTERFACE
 * Returns environment configuration derived from process.env for runtime decisions.
 */
export function getEnv() {
  const apiBase = (RAW.API_BASE || RAW.BACKEND_URL || '').trim();
  return {
    apiBase: apiBase || null
  };
}
