import { SignJWT, jwtVerify } from 'jose';
import { TokenPayload } from '../types';
import { cookies } from 'next/headers';
import { AuthUser } from '@/app/types/github';
import crypto from 'crypto';
import { prisma } from '@/app/lib/prisma';
import { Role } from '../types';

// Создаем секретные ключи для JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-at-least-32-chars'
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || 'your-refresh-super-secret-key-atleast-32-chars'
);

// Создание JWT токена
export async function signJWT(payload: TokenPayload, expiresIn = '15m'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// Создание Refresh токена
export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);
}

// Проверка JWT токена
export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Safely convert JWTPayload to TokenPayload
    const tokenPayload: TokenPayload = {
      id: payload.id as string,
      username: payload.username as string,
      email: payload.email as string,
      avatarUrl: payload.avatarUrl as string | undefined,
      ...payload
    };
    return tokenPayload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}

// Проверка Refresh токена
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    // Safely convert JWTPayload to TokenPayload
    const tokenPayload: TokenPayload = {
      id: payload.id as string,
      username: payload.username as string,
      email: payload.email as string,
      avatarUrl: payload.avatarUrl as string | undefined,
      ...payload
    };
    return tokenPayload;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return null;
  }
}

// Хеширование пароля с солью
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512')
    .toString('hex');
  
  return { hash, salt: generatedSalt };
}

// Проверка пароля
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const generatedHash = hashPassword(password, salt).hash;
  return generatedHash === hash;
}

// Registration of a user and saving to the database
export async function registerUser(username: string, email: string, password: string): Promise<boolean> {
  try {
    // Check if a user with the same username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return false;
    }

    // Hash the password
    const { hash, salt } = hashPassword(password);

    // Create a user in the database
    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hash,
        salt,
        role: Role.USER
      }
    });

    return true;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
}

// Аутентификация пользователя с использованием БД
export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    // If the user doesn't exist, return null
    if (!user) {
      // Check if this is the administrator
      if (username === 'admin' && password === process.env.ADMIN_PASSWORD && process.env.ADMIN_EMAIL) {
        // Create administrator if they don't exist in the database
        const { hash, salt } = hashPassword(password);
        
        const adminUser = await prisma.user.create({
          data: {
            username: 'admin',
            email: process.env.ADMIN_EMAIL,
            passwordHash: hash,
            salt,
            role: Role.ADMIN
          }
        });
        
        return {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          isAuthenticated: true
        };
      }
      return null;
    }

    // Verify the password
    const isPasswordValid = verifyPassword(password, user.passwordHash, user.salt);
    
    if (!isPasswordValid) {
      return null;
    }

    // Explicitly get the avatar URL using raw SQL
    const result = await prisma.$queryRaw<{avatarUrl: string | null}[]>`
      SELECT "avatarUrl" FROM "User" WHERE id = ${user.id}
    `;
    const avatarUrl = result && result.length > 0 ? result[0].avatarUrl : null;

    // Return user data
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: avatarUrl || undefined,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Save refresh token in the database
export async function saveRefreshToken(userId: string, token: string): Promise<boolean> {
  try {
    // Delete old user tokens
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });

    // Calculate expiration date (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save new token
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });

    return true;
  } catch (error) {
    console.error('Error saving refresh token:', error);
    return false;
  }
}

// Verify refresh token in the database
export async function findRefreshToken(token: string): Promise<boolean> {
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!storedToken) {
      return false;
    }

    // Check if the token has expired
    const now = new Date();
    if (storedToken.expiresAt < now) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error finding refresh token:', error);
    return false;
  }
}

// Set token cookies
export async function setAuthCookies(token: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Set Access Token (httpOnly for security)
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/'
  });
  
  // Set Refresh Token
  cookieStore.set({
    name: 'refreshToken',
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

// Delete cookies on logout
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('refreshToken');
} 