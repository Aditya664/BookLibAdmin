export interface User {
  id?: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}


export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

export interface UserCreateRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateRequest extends Partial<Omit<UserCreateRequest, 'password'>> {
  id: number;
  isActive?: boolean;
}
