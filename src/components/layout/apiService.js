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

  if (token) {
    mergedOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle request body logic
  const method = (mergedOptions.method || 'GET').toUpperCase();

  // ***** THE FIX IS HERE *****
  // Agar request POST/PUT/PATCH hai aur usmein body nahi hai, to ek empty body jod dein.
  // Yeh "Content-Length: 0" wali samasya ko theek karta hai.
  if (['POST', 'PUT', 'PATCH'].includes(method) && !mergedOptions.body) {
    mergedOptions.body = {};
  }

  // Body ko tabhi stringify karein jab woh ek object ho.
  if (mergedOptions.body && typeof mergedOptions.body !== 'string') {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'An unknown API error occurred');
    }
    
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;

  } catch (error) {
    console.error(`API service error for endpoint "${endpoint}":`, error);
    throw error;
  }
};

