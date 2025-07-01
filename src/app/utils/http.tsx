import axios from "axios";
import cookie from "./cookie";

const REACT_APP_API_BASEURL = process.env.NODE_ENV === 'development' 
  ? "/api/v1" 
  : "https://banyan.backend.ricive.com/api/v1";

// Utility function to extract error message from API response
export const extractErrorMessage = (error: any): string => {
  // Check for network errors
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Check for timeout errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Check for CORS errors
  if (error.message.includes('CORS')) {
    return 'Cross-origin request blocked. Please try again.';
  }

  // Check for API response errors
  if (error.response?.data) {
    const responseData = error.response.data;
    
    // Handle different error response formats
    if (typeof responseData === 'string') {
      return responseData;
    }
    
    if (typeof responseData === 'object') {
      // Check for message field
      if (responseData.message) {
        return responseData.message;
      }
      
      // Check for error field
      if (responseData.error) {
        return typeof responseData.error === 'string' 
          ? responseData.error 
          : responseData.error.message || 'An error occurred';
      }
      
      // Check for errors field (validation errors)
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          return responseData.errors.join(', ');
        }
        if (typeof responseData.errors === 'object') {
          return Object.values(responseData.errors).flat().join(', ');
        }
      }
      
      // Check for statusText
      if (responseData.statusText) {
        return responseData.statusText;
      }
    }
  }

  // Check for HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Bad request. Please check your input and try again.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Access forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return `Error ${error.response.status}. Please try again.`;
    }
  }

  // Fallback error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

// Custom hook for consistent error handling
export const useApiError = () => {
  const handleApiError = (error: any, fallbackMessage?: string): string => {
    // Use the extracted message from the HTTP interceptor if available
    if (error.extractedMessage) {
      return error.extractedMessage;
    }
    
    // Fallback to manual extraction
    const errorMessage = extractErrorMessage(error);
    return errorMessage || fallbackMessage || 'An error occurred. Please try again.';
  };

  return { handleApiError };
};

export const Http = axios.create({
  baseURL: REACT_APP_API_BASEURL,
  timeout: 45000,
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Http.interceptors.request.use((config: any) => {
  console.log('Http request interceptor - URL:', config.url);
  console.log('Http request interceptor - Method:', config.method);
  console.log('Http request interceptor - Data:', config.data);
  
  const token = cookie().getCookie("token");
  const userType = cookie().getCookie("userType");
  console.log(token, 'token______');
  // const apiKey = cookie().getCookie("API_KEY");


  // Read and combine token parts
  //  const numParts = parseInt(cookie().getCookie('token_parts') || '0');
  //  let combinedToken = '';
  //  for (let i = 0; i < numParts; i++) {
  //    combinedToken += cookie().getCookie(`token_part_${i}`) || '';
  //  }


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // let kk =  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MWIxOWVhNC03NjdhLTQwMzgtOTZhNC1kZDE5ODMxNWE1YWYiLCJyb2xlSWQiOiIxMzBhMDk4Yy0xMTI3LTQ0ODktYjZlMi1kMjRiNzkyYTljMTgiLCJidXNpbmVzc0lkIjoiYzBlZjQzNTAtNDk2OC00NTdhLWE1NGYtZTM3ZTM1YzJmODFhIiwiZmlyc3ROYW1lIjoiSm9lbCIsImxhc3ROYW1lIjoiVWd3dW1hZHUiLCJlbWFpbCI6InVnd3VtYWR1MTE2QGdtYWlsLmNvbSIsImlhdCI6MTczMjE0NzA2MywiZXhwIjoxNzMyMjMzNDYzfQ.r2ldsZULzYlgcQKkd3CTqN10VCSVC5_1KtGLY6qsYwY`
  // if (combinedToken && config.url !== "/auth/signin") {
  //   config.headers.Authorization = `Bearer ${kk}`;
  //   // config.headers.Authorization = `Bearer ${combinedToken}`;
  // }
  if (userType) {
    config.headers["X-User-Type"] = userType;
  }
  // if (apiKey) {
  //   config.headers["X-API-KEY"] = apiKey;
  // }

  console.log('Http request interceptor - Final config:', config);
  return config;
});

Http.interceptors.response.use(
  (response: any) => {
    console.log('Http response interceptor - Success:', response);
    return response.data;
  },
  (error: any) => {
    console.log('Http response interceptor - Error:', error);
    console.log('Http response interceptor - Error response:', error.response);
    
    // Extract error message for logging
    const errorMessage = extractErrorMessage(error);
    console.log('Extracted error message:', errorMessage);
    
    if (error.response?.status) {
      if (
        error.response.status === 401 ||
        error?.response?.data?.statusCode == 401
      ) {
        const currentPath = window.location.pathname;
        if (currentPath.includes("dashboard")) {
          // window.location.pathname = "/login";
        }
        cookie().deleteCookie("token");
      }

      if (error.response.status === 500) {
        console.log("Server error occurred");
      }
    }

    // Enhance the error object with the extracted message
    error.extractedMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

export default Http;
