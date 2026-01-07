import { api } from '../axios.config';
import { ApiEndpoints } from '../endpoints';
import type { ApiResponse } from '../../interfaces/apiRequestInterface';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(ApiEndpoints.LOGIN, credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post(ApiEndpoints.LOGOUT);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>(
      ApiEndpoints.REFRESH_TOKEN,
      { refreshToken }
    );
    return response.data;
  },
};

