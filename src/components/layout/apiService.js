import { API_BASE_URL } from '../../api/config';

export const apiService = async (endpoints, options = {}) => {
  console.log(`API Service called for endpoint: ${endpoints}`);
  if (!endpoints) {
    throw new Error('API endpoint is required');
  } 
  const url = `${API_BASE_URL}${endpoints}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  // Automatically add Authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Handle request body
  if (options.body) {
    // For file uploads, let the browser set the Content-Type
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type']; // Browser will set this with boundary
      config.body = options.body;
    } else {
      // For all other requests, stringify the body and set Content-Type
      config.body = JSON.stringify(options.body);
      config.headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `Request failed with status: ${response.status}` 
      }));
      throw new Error(errorData.message || 'An unknown API error occurred');
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return { success: true, data: null };
    }

    return await response.json();

  } catch (error) {
    console.error(`API service error for endpoint "${endpoints}":`, error);
    throw error;
  }
};

