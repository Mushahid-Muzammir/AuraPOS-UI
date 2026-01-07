import axios, { AxiosError} from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
    baseURL : import.meta.env.SERVER_URL || 'http://localhost:5006',
    headers: {
        'Content-Type': 'application/json',
    },
})

//Add auth token to request headers
api.interceptors.request.use(
    (config : InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error : AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error : AxiosError) => {
        if(error.response?.status === 401) {
            localStorage.removeItem('authToken');
            toast.error('Incorrect Password! Please try again.');
            window.location.href = '/';
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
        console.error('Access denied');
        toast.error('Access denied. You do not have permission to perform this action.');
        window.location.href = '/';
        }

        // Handle network errors
        if (!error.response) {
        console.error('Network error - please check your connection');
        toast.error('Network error - please check your connection');
        }

        return Promise.reject(error);
    }
)