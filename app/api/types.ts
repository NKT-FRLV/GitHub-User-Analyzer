import { AuthUser } from '../types/github';
import { JWTPayload } from 'jose';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
}

export interface TokenPayload extends JWTPayload {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  [key: string]: any; // This makes TokenPayload compatible with JWTPayload
} 