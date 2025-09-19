import { API_BASE_URL } from '../../api/config';

export const apiService = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  if (token && !endpoint.includes('/signup') && !endpoint.includes('/login')) {
    mergedOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle file uploads separately
  if (options.body instanceof FormData) {
    // For FormData, let the browser set the Content-Type header
    delete mergedOptions.headers['Content-Type'];
  } else if (mergedOptions.body) {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }

  try {
    const response = await fetch(url, mergedOptions);

    // --- FIX START ---
    // Handle 404 specifically by returning null instead of throwing an error.
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'An unknown API error occurred');
    }
    // --- FIX END ---
    
    // Handle responses that might not have a body (e.g., 204 No Content)
    if (response.status === 204) {
        return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API service error for endpoint "${endpoint}":`, error);
    throw error;
  }
};
