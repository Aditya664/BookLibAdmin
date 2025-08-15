export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
    jwtToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthUser {
    jwtToken:string;
}
