import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, AuthResponse } from '../../types';
import { registerUser } from '../../utils/auth';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body: RegisterRequest = await request.json();
    const { username, email, password } = body;

    // Проверка полей
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Проверка корректности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Некорректный email' },
        { status: 400 }
      );
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    // Регистрируем пользователя
    const success = await registerUser(username, email, password);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Пользователь с таким именем или email уже существует' },
        { status: 409 }
      );
    }

    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      message: 'Регистрация прошла успешно'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 