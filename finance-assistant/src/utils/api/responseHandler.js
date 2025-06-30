/**
 * Handles API responses and returns formatted data
 * @param {Object} response - The response object from the API
 * @returns {Object} - The formatted response data
 */
export const handleApiResponse = (response) => {
  if (!response || !response.data) {
    return null;
  }

  return response.data;
};

/**
 * Formats paginated response data
 * @param {Object} response - The paginated response object from the API
 * @returns {Object} - The formatted paginated data
 */
export const formatPaginatedResponse = (response) => {
  if (!response || !response.data) {
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    };
  }

  const { data, total, page, limit, pages } = response.data;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  };
};

/**
 * Formats date range for API requests
 * @param {Object} dateRange - The date range object
 * @returns {Object} - The formatted date range
 */
export const formatDateRange = (dateRange) => {
  if (!dateRange) {
    return {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
  }

  return {
    startDate: dateRange.startDate || new Date().toISOString().split('T')[0],
    endDate: dateRange.endDate || new Date().toISOString().split('T')[0]
  };
};

/**
 * Formats filter parameters for API requests
 * @param {Object} filters - The filter parameters
 * @returns {Object} - The formatted filter parameters
 */
export const formatFilters = (filters) => {
  if (!filters) {
    return {};
  }

  const formattedFilters = { ...filters };

  // Remove undefined or null values
  Object.keys(formattedFilters).forEach(key => {
    if (formattedFilters[key] === undefined || formattedFilters[key] === null) {
      delete formattedFilters[key];
    }
  });

  return formattedFilters;
};

export default {
  handleApiResponse,
  formatPaginatedResponse,
  formatDateRange,
  formatFilters
}; 