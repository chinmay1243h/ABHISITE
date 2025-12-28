import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Course Management API
 */
export const courseService = {
  /**
   * Create a new course
   */
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  /**
   * Get all courses for the current user
   */
  getMyCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },

  /**
   * Get course by ID
   */
  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  /**
   * Update course
   */
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  /**
   * Delete course
   */
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },

  /**
   * Submit course for approval
   */
  submitForApproval: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/submit-for-approval`);
    return response.data;
  },

  /**
   * Get published courses (for students)
   */
  getPublishedCourses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/courses/published?${params}`);
    return response.data;
  },
};

/**
 * File Management API
 */
export const fileService = {
  /**
   * Upload file to Telegram
   */
  uploadFile: async (file, courseId, description = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);
    formData.append('description', description);

    const response = await api.post('/telegram-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        return percentCompleted;
      },
    });

    return response.data;
  },

  /**
   * Get file stream URL
   */
  getFileStreamUrl: (fileId) => {
    return `${API_BASE_URL}/telegram-files/${fileId}/stream`;
  },

  /**
   * Get file download URL
   */
  getFileDownloadUrl: (fileId) => {
    return `${API_BASE_URL}/telegram-files/${fileId}/download`;
  },

  /**
   * Get file information
   */
  getFileInfo: async (fileId) => {
    const response = await api.get(`/telegram-files/${fileId}/info`);
    return response.data;
  },

  /**
   * Delete file
   */
  deleteFile: async (fileId) => {
    const response = await api.delete(`/telegram-files/${fileId}`);
    return response.data;
  },

  /**
   * Get files for a course
   */
  getCourseFiles: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/files`);
    return response.data;
  },
};

/**
 * Authentication API
 */
export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get stored user data
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get user role
   */
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || 'User';
  },
};

export default api;
