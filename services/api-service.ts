import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const store = useAuthStore.getState();
//     if (store.accessToken) {
//       config.headers.Authorization = `Bearer ${store.accessToken}`;
//     }
//     return config;
//   }, 
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default apiClient