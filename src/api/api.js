import axios from 'axios';

// Create a custom Axios instance
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Base URL for your backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add the auth token to headers before every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            // Use the header name expected by your backend middleware (x-auth-token)
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 Unauthorized errors globally (optional but good)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized request. Token might be expired.');
            localStorage.removeItem('token');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default API;