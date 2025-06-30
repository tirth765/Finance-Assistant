// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    PREFERENCES: '/user/preferences'
  },
  BUDGET: {
    BASE: '/api/v1/budget',
    LIST: '/api/v1/budget/list',
    ADD: '/api/v1/budget/add',
    ANALYSIS: '/api/v1/budget/analysis',
    CATEGORIES: '/api/v1/budget/categories'
  },
  TRANSACTION: {
    BASE: '/transaction',
    CATEGORIES: '/transaction/categories',
    STATISTICS: '/transaction/statistics'
  },
  GOAL: {
    BASE: '/goal',
    PROGRESS: '/goal/progress'
  },
  NOTIFICATION: {
    BASE: '/notification',
    PREFERENCES: '/notification/preferences'
  },
  REPORT: {
    INCOME: '/report/income',
    EXPENSE: '/report/expense',
    SUMMARY: '/report/summary',
    EXPORT: '/report/export'
  },
  REVIEW:{
   BASE: '/api/v1/review',
    LIST: '/api/v1/review/get',
    POST: '/api/v1/review/post',
    UPDATE: '/api/v1/review/update',
  }
};

// API Response Status Codes
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500
};

// API Request Methods
export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// API Headers
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept'
};

// API Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data'
};

// API Timeouts (in milliseconds)
export const TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 30000
};

// API Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export default {
  API_ENDPOINTS,
  STATUS_CODES,
  REQUEST_METHODS,
  HEADERS,
  CONTENT_TYPES,
  TIMEOUTS,
  PAGINATION
}; 