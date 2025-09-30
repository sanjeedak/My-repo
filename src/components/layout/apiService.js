import { API_BASE_URL } from '../../api/config';

export const apiService = async (endpoint, options = {}) => {
  console.log(`API Service called for endpoint: ${endpoint}`);
  if (!endpoint) {
    throw new Error('API endpoint is required');
  }

  // Build full URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const config = {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  };

  // Add Authorization header automatically if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle request body
  if (options.body) {
    if (options.body instanceof FormData) {
      // For file uploads, let the browser set the Content-Type
      delete config.headers['Content-Type'];
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
      config.headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(url, config);

    // If response is NOT OK, provide more details
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If the error response is not JSON, get it as text.
        const errorText = await response.text();
        console.error("Non-JSON API Error Response:", errorText);
        throw new Error(`Request failed with status: ${response.status}. Server response: ${errorText}`);
      }
      // Log the detailed error from the server
      console.error("API Error Data:", errorData);
      throw new Error(errorData.message || 'An unknown API error occurred');
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return { success: true, data: null };
    }

    return await response.json();
  } catch (error) {
    console.error(`API service error for endpoint "${endpoint}":`, error);
    throw error;
  }
};