import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, AuthResponse } from '../../types';
import { authenticateUser, signJWT, signRefreshToken, setAuthCookies, saveRefreshToken } from '../../utils/auth';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Проверяем учетные данные пользователя
    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Неверное имя пользователя или пароль' },
        { status: 401 }
      );
    }

    // Создаем JWT токены
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl
    };

    const token = await signJWT(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    // Сохраняем refresh token в БД
    await saveRefreshToken(user.id, refreshToken);

    // Устанавливаем куки для доступа
    await setAuthCookies(token, refreshToken);

    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      user,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 