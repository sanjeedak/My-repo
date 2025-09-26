
//  production base URL, can override with .env
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "https://shopzeo.in"; // fallback to /api

