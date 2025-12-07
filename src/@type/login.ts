export interface AuthTokens {
  accessToken: string;
  expiresIn?: number;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  tokens: AuthTokens;
}

