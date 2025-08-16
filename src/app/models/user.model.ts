export interface User {
  id?: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  roles: string[];
  hasSubscription: boolean;
  isActive?: boolean;
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
