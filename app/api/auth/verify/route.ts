import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT, verifyRefreshToken, signJWT, signRefreshToken, setAuthCookies, findRefreshToken, saveRefreshToken } from '../../utils/auth';
import { AuthResponse } from '../../types';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // If there's no token, the user is not authenticated
    if (!token) {
      // Check if there's a refresh token to try to renew the session
      if (refreshToken) {
        // Verify the refresh token in the database
        const isValidRefreshToken = await findRefreshToken(refreshToken);
        
        if (!isValidRefreshToken) {
          return NextResponse.json(
            { success: false, message: 'Invalid refresh token' },
            { status: 401 }
          );
        }
        
        const userData = await verifyRefreshToken(refreshToken);
        
        if (userData) {
          // Check if the user exists in the database
          const user = await prisma.user.findUnique({
            where: { id: userData.id }
          });
          
          if (!user) {
            return NextResponse.json(
              { success: false, message: 'User not found' },
              { status: 401 }
            );
          }
          
          // Create a new access token
          const newToken = await signJWT({
            id: userData.id,
            username: userData.username,
            email: userData.email
          });
          
          // Create a new refresh token
          const newRefreshToken = await signRefreshToken({
            id: userData.id,
            username: userData.username,
            email: userData.email
          });
          
          // Save the new refresh token in the database
          await saveRefreshToken(userData.id, newRefreshToken);
          
          // Set new cookies
          await setAuthCookies(newToken, newRefreshToken);
          
          // Explicitly get the avatar URL using raw SQL
          const result = await prisma.$queryRaw<{avatarUrl: string | null}[]>`
            SELECT "avatarUrl" FROM "User" WHERE id = ${user.id}
          `;
          const avatarUrl = result && result.length > 0 ? result[0].avatarUrl : null;
          
          return NextResponse.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              avatarUrl: avatarUrl || undefined,
              isAuthenticated: true
            }
          });
        }
      }
      
      return NextResponse.json(
        { success: false, message: 'User is not authenticated' },
        { status: 401 }
      );
    }

    // Verify token validity
    const userData = await verifyJWT(token);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: userData.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }

    // Explicitly get the avatar URL using raw SQL
    const result = await prisma.$queryRaw<{avatarUrl: string | null}[]>`
      SELECT "avatarUrl" FROM "User" WHERE id = ${user.id}
    `;
    const avatarUrl = result && result.length > 0 ? result[0].avatarUrl : null;

    // Return user information
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: avatarUrl || undefined,
        isAuthenticated: true
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Error verifying token' },
      { status: 500 }
    );
  }
} 