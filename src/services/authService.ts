import { publicClient } from "./api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface RegisterResult {
  email: string;
  verified: boolean;
  createdAt: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  id: number;
  username: string;
  role: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  token: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  };
}

export interface OAuthLoginRequest {
  provider: "facebook" | "google";
  accessToken: string;
}

export const AuthService = {
  register: async (payload: RegisterPayload) => {
    const response = await publicClient.post<ApiResponse<RegisterResult>>(
      "/auth/register",
      payload
    );
    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await publicClient.post<ApiResponse<LoginResult>>(
      "/auth/login",
      payload
    );
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await publicClient.post("/auth/verify-otp", data);
    return response.data;
  },

  oauthLogin: async (request: OAuthLoginRequest) => {
    const response = await publicClient.post<ApiResponse<LoginResult>>(
        "/auth/oauth/login",
        request
    );
    return response.data;
  },
};