export interface AuthTokens {
  accessToken: string;
  expiresIn?: number;
}

export interface AuthUser {
  username: string;
  role: string;
  email?: string;
  fullName?: string;
  tokens: AuthTokens;
}

