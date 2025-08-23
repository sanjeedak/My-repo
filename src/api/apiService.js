// src/api/apiService.js
import { API_BASE_URL } from './config';

/**
 * A reusable function to make API calls.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/products').
 * @param {object} options - Optional fetch options (method, body, headers).
 * @returns {Promise<any>} - A promise that resolves with the API data.
 */
export const apiService = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  // Stringify body if it's an object
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle network errors and API errors in one place
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Network response was not ok: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API service error for endpoint ${endpoint}:`, error);
    throw error;
  }
};