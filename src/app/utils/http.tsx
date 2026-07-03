import axios from "axios";
import cookie from "./cookie";
import {
  clearAuthSession,
  sanitizeClientErrorMessage,
  setAuthFlash,
} from "./security";

const REACT_APP_API_BASEURL = process.env.NODE_ENV === 'development' 
  ? "/api/v1" 
  : "https://api.banyanclaims.com/api/v1";

// Utility function to extract error message from API response
export const extractErrorMessage = (error: any): string => {
  const status = error.response?.status;

  // Check for network errors
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return sanitizeClientErrorMessage('Network error. Please check your internet connection and try again.', status);
  }

  // Check for timeout errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return sanitizeClientErrorMessage('Request timed out. Please try again.', status);
  }

  // Check for CORS errors
  if (error.message.includes('CORS')) {
    return sanitizeClientErrorMessage('Cross-origin request blocked. Please try again.', status);
  }

  let rawMessage = '';

  // Check for API response errors
  if (error.response?.data) {
    const responseData = error.response.data;
    
    // Handle different error response formats
    if (typeof responseData === 'string') {
      rawMessage = responseData;
    } else if (typeof responseData === 'object') {
      // Check for message field
      if (responseData.message) {
        rawMessage = responseData.message;
      } else if (responseData.error) {
        rawMessage = typeof responseData.error === 'string' 
          ? responseData.error 
          : responseData.error.message || 'An error occurred';
      } else if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          rawMessage = responseData.errors.join(', ');
        } else if (typeof responseData.errors === 'object') {
          rawMessage = Object.values(responseData.errors).flat().join(', ');
        }
      } else if (responseData.statusText) {
        rawMessage = responseData.statusText;
      }
    }
  }

  if (rawMessage) {
    return sanitizeClientErrorMessage(rawMessage, status);
  }

  // Check for HTTP status codes
  if (status) {
    switch (status) {
      case 400:
        return sanitizeClientErrorMessage('Bad request. Please check your input and try again.', status);
      case 401:
        return sanitizeClientErrorMessage('Unauthorized. Please log in again.', status);
      case 403:
        return sanitizeClientErrorMessage('You do not have permission to perform this action.', status);
      case 404:
        return sanitizeClientErrorMessage('Resource not found.', status);
      case 422:
        return sanitizeClientErrorMessage('Please check your input and try again.', status);
      case 429:
        return sanitizeClientErrorMessage('Too many requests. Please try again later.', status);
      case 500:
      case 502:
      case 503:
        return sanitizeClientErrorMessage('Server error. Please try again later.', status);
      default:
        return sanitizeClientErrorMessage('Something went wrong. Please try again.', status);
    }
  }

  return sanitizeClientErrorMessage('An unexpected error occurred. Please try again.', status);
};

// Custom hook for consistent error handling
export const useApiError = () => {
  const handleApiError = (error: any, fallbackMessage?: string): string => {
    if (error.extractedMessage) {
      return error.extractedMessage;
    }
    
    const errorMessage = extractErrorMessage(error);
    return errorMessage || fallbackMessage || 'An error occurred. Please try again.';
  };

  return { handleApiError };
};

export const Http = axios.create({
  baseURL: REACT_APP_API_BASEURL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Http.interceptors.request.use((config: any) => {
  const token = cookie().getCookie("token");
  const userType = cookie().getCookie("userType");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userType) {
    config.headers["X-User-Type"] = userType;
  }

  return config;
});

Http.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    const errorMessage = extractErrorMessage(error);
    
    if (error.response?.status) {
      if (
        error.response.status === 401 ||
        error.response.status === 403 ||
        error?.response?.data?.statusCode == 401 ||
        error?.response?.data?.statusCode == 403
      ) {
        clearAuthSession();
        setAuthFlash('Session expired. Please log in again.');
        window.location.replace('/portal');
      }
    }

    error.extractedMessage = errorMessage;
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default Http;
