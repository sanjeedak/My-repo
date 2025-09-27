
//  production base URL, can override with .env
export const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL ||
  import.meta.env.VITE_APP_API_URL ||
  "https://shopzeo.in"; // fallback to /api

