import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const apiClient = {
  // Auth methods
  login: async (email, password) => {
    const response = await api.post('/auth/login', { username: email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // Book methods
  getBooks: async (params = {}) => {
    const response = await api.get('/api/books', { params });
    return response.data;
  },

  getBook: async (bookId) => {
    const response = await api.get(`/api/books/${bookId}`);
    return response.data;
  },

  searchBooks: async (query, semantic = false) => {
    const endpoint = semantic ? '/api/search/semantic' : '/api/search';
    const response = await api.get(endpoint, { params: { q: query } });
    return response.data;
  },

  borrowBook: async (bookId) => {
    const response = await api.post('/api/borrow', { book_id: bookId });
    return response.data;
  },

  returnBook: async (borrowingId) => {
    const response = await api.post(`/api/return/${borrowingId}`);
    return response.data;
  },

  getMyBorrowings: async () => {
    const response = await api.get('/api/my-borrowings');
    return response.data;
  },

  // Reading methods
  startReadingSession: async (bookId) => {
    const response = await api.post('/api/reading/start', { book_id: bookId });
    return response.data;
  },

  endReadingSession: async (sessionId, pagesRead) => {
    const response = await api.post(`/api/reading/end/${sessionId}`, null, {
      params: { pages_read: pagesRead }
    });
    return response.data;
  },

  getReadingStats: async () => {
    const response = await api.get('/api/reading/stats');
    return response.data;
  },

  // Recommendations
  getRecommendations: async (limit = 10) => {
    const response = await api.get('/api/recommendations', { params: { limit } });
    return response.data;
  },

  // Profile
  getProfileStats: async () => {
    const response = await api.get('/api/profile/stats');
    return response.data;
  },

  // Analytics (for librarians/admins)
  getLibraryAnalytics: async () => {
    const response = await api.get('/api/analytics/library');
    return response.data;
  },

  // Generic methods
  get: async (url, config = {}) => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async (url, data = {}, config = {}) => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  put: async (url, data = {}, config = {}) => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  delete: async (url, config = {}) => {
    const response = await api.delete(url, config);
    return response.data;
  },
};

export default apiClient;
