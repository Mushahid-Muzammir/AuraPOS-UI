import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginRequest } from "../api/services/authService";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      toast.success(data.message || 'Login successful!');
      navigate('/home');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    
    onSuccess: () => {
      queryClient.clear();
      navigate('/admin');
      toast.success('Logged out successfully');
    },
    
    onError: (error: any) => {
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      navigate('/admin');
      toast.error(error.response?.data?.message || 'Logout failed');
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    },
    
    onError: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/admin';
    },
  });
};

