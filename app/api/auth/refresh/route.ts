import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyRefreshToken, 
  signJWT, 
  signRefreshToken,
  saveRefreshToken 
} from '../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const userData = await verifyRefreshToken(refreshToken);
    if (!userData) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Создаем новые токены
    const newToken = await signJWT({
      id: userData.id,
      username: userData.username,
      email: userData.email
    });

    const newRefreshToken = await signRefreshToken({
      id: userData.id,
      username: userData.username,
      email: userData.email
    });

    // Сохраняем новый refresh token
    await saveRefreshToken(userData.id, newRefreshToken);

    // Устанавливаем куки
    const response = NextResponse.json({ success: true });

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 