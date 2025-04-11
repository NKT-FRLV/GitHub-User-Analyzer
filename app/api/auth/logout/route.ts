import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, verifyJWT } from '../../utils/auth';
import { AuthResponse } from '../../types';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';

export async function POST(_request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Если есть token, получаем ID пользователя для удаления рефреш-токена из БД
    if (token) {
      const userData = await verifyJWT(token);
      if (userData) {
        // Удаляем все рефреш-токены пользователя из БД
        await prisma.refreshToken.deleteMany({
          where: { userId: userData.id }
        });
      }
    }
    
    // Если есть refreshToken, удаляем его из БД
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    }

    // Удаляем JWT токены из куки
    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: 'You have successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 