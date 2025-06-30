import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './constants';
import { handleApiResponse, formatPaginatedResponse, formatDateRange, formatFilters } from './responseHandler';

// Auth API
export const authAPI = {
  login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  refreshToken: () => axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN),
  verifyEmail: (token) => axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),
  resetPassword: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  forgotPassword: (email) => axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
};

// User API
export const userAPI = {
  getProfile: () => axiosInstance.get(API_ENDPOINTS.USER.PROFILE),
  updateProfile: (profileData) => axiosInstance.put(API_ENDPOINTS.USER.PROFILE, profileData),
  getSettings: () => axiosInstance.get(API_ENDPOINTS.USER.SETTINGS),
  updateSettings: (settingsData) => axiosInstance.put(API_ENDPOINTS.USER.SETTINGS, settingsData),
  getPreferences: () => axiosInstance.get(API_ENDPOINTS.USER.PREFERENCES),
  updatePreferences: (preferencesData) => axiosInstance.put(API_ENDPOINTS.USER.PREFERENCES, preferencesData)
};

// Budget API
export const budgetAPI = {
  getAll: (filters) => axiosInstance.get(API_ENDPOINTS.BUDGET.BASE, { params: formatFilters(filters) }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.BUDGET.BASE}/${id}`),
  create: (budgetData) => axiosInstance.post(API_ENDPOINTS.BUDGET.ADD, budgetData),
  update: (id, budgetData) => axiosInstance.put(`${API_ENDPOINTS.BUDGET.BASE}/${id}`, budgetData),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.BUDGET.BASE}/${id}`),
  getAnalysis: (dateRange) => axiosInstance.get(API_ENDPOINTS.BUDGET.ANALYSIS, { params: formatDateRange(dateRange) }),
  getCategories: () => axiosInstance.get(API_ENDPOINTS.BUDGET.CATEGORIES)
};

// Transaction API
export const transactionAPI = {
  getAll: (filters) => axiosInstance.get(API_ENDPOINTS.TRANSACTION.BASE, { params: formatFilters(filters) }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.TRANSACTION.BASE}/${id}`),
  create: (transactionData) => axiosInstance.post(API_ENDPOINTS.TRANSACTION.BASE, transactionData),
  update: (id, transactionData) => axiosInstance.put(`${API_ENDPOINTS.TRANSACTION.BASE}/${id}`, transactionData),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.TRANSACTION.BASE}/${id}`),
  getCategories: () => axiosInstance.get(API_ENDPOINTS.TRANSACTION.CATEGORIES),
  getStatistics: (dateRange) => axiosInstance.get(API_ENDPOINTS.TRANSACTION.STATISTICS, { params: formatDateRange(dateRange) })
};

// Goal API
export const goalAPI = {
  getAll: (filters) => axiosInstance.get(API_ENDPOINTS.GOAL.BASE, { params: formatFilters(filters) }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.GOAL.BASE}/${id}`),
  create: (goalData) => axiosInstance.post(API_ENDPOINTS.GOAL.BASE, goalData),
  update: (id, goalData) => axiosInstance.put(`${API_ENDPOINTS.GOAL.BASE}/${id}`, goalData),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.GOAL.BASE}/${id}`),
  updateProgress: (id, progress) => axiosInstance.put(`${API_ENDPOINTS.GOAL.PROGRESS}/${id}`, { progress })
};

// Notification API
export const notificationAPI = {
  getAll: (filters) => axiosInstance.get(API_ENDPOINTS.NOTIFICATION.BASE, { params: formatFilters(filters) }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.NOTIFICATION.BASE}/${id}`),
  create: (notificationData) => axiosInstance.post(API_ENDPOINTS.NOTIFICATION.BASE, notificationData),
  markAsRead: (id) => axiosInstance.put(`${API_ENDPOINTS.NOTIFICATION.BASE}/${id}/read`),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.NOTIFICATION.BASE}/${id}`),
  getPreferences: () => axiosInstance.get(API_ENDPOINTS.NOTIFICATION.PREFERENCES),
  updatePreferences: (preferences) => axiosInstance.put(API_ENDPOINTS.NOTIFICATION.PREFERENCES, preferences)
};

//  Review API
export const reviewAPI = {
  getAll: () => axiosInstance.get(API_ENDPOINTS.REVIEW.LIST),
  create: (reviewData) => axiosInstance.post(API_ENDPOINTS.REVIEW.POST, reviewData),
  update: (id, reviewData) => axiosInstance.put(`${API_ENDPOINTS.REVIEW.UPDATE}/${id}`, reviewData),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.REVIEW.BASE}/delete/${id}`),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.REVIEW.BASE}/${id}`)
};

// Report API
export const reportAPI = {
  getIncomeReport: (dateRange) => axiosInstance.get(API_ENDPOINTS.REPORT.INCOME, { params: formatDateRange(dateRange) }),
  getExpenseReport: (dateRange) => axiosInstance.get(API_ENDPOINTS.REPORT.EXPENSE, { params: formatDateRange(dateRange) }),
  getFinancialSummary: (dateRange) => axiosInstance.get(API_ENDPOINTS.REPORT.SUMMARY, { params: formatDateRange(dateRange) }),
  exportReports: (format, dateRange) => axiosInstance.get(API_ENDPOINTS.REPORT.EXPORT, { 
    params: { format, ...formatDateRange(dateRange) },
    responseType: 'blob'
  })
};

export default {
  auth: authAPI,
  user: userAPI,
  budget: budgetAPI,
  transaction: transactionAPI,
  goal: goalAPI,
  notification: notificationAPI,
  report: reportAPI
};
