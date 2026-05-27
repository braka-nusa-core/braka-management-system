export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    accessToken?: string;
    access_token?: string;
    user?: AuthUser;
  };
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: AuthUser;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}
