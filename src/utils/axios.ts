import axios from 'axios';
import { navigateToLogin } from './navigateToLogin';

const getAuthToken = () => localStorage.getItem('accessToken');

// Create a default Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Create an Axios instance for file uploads
export const axiosFileInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Create a DELETE Axios instance dynamically with an authorization token
export const createAxiosDeleteInstance = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

// Request Interceptor to dynamically attach token
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor for handling API errors
axiosInstance.interceptors.response.use(
  (response) => response?.data,
  (error) => {
    if (error?.response?.status === 401) {
      navigateToLogin();
    }
    return Promise.reject(error?.response?.data || error);
  }
);

// Set the token in the file instance's headers
axiosFileInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
