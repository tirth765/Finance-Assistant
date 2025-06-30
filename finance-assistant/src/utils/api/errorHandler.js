/**
 * Handles API errors and returns a formatted error message
 * @param {Error} error - The error object from the API
 * @returns {string} - A formatted error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    // Check if the server returned a specific error message
    if (data && data.message) {
      return data.message;
    }
    
    // If no specific message, return a generic one based on status code
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to access this resource.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. This resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${status}. Please try again.`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return `Error: ${error.message}`;
  }
};

/**
 * Formats validation errors from the API
 * @param {Object} errors - The validation errors object from the API
 * @returns {string[]} - An array of formatted error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return [];
  
  if (typeof errors === 'string') {
    return [errors];
  }
  
  if (Array.isArray(errors)) {
    return errors;
  }
  
  // Handle object with field errors
  return Object.keys(errors).map(field => {
    const error = errors[field];
    if (Array.isArray(error)) {
      return `${field}: ${error.join(', ')}`;
    }
    return `${field}: ${error}`;
  });
};

/**
 * Checks if an error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if the error is a network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Checks if an error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean} - True if the error is an authentication error
 */
export const isAuthError = (error) => {
  return error.response && error.response.status === 401;
};

export default {
  handleApiError,
  formatValidationErrors,
  isNetworkError,
  isAuthError
}; 