import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { signJWT } from '../../utils/auth';
import { TokenPayload } from '../../types';
import crypto from 'crypto';

// Функция для генерации случайного кода
function generateResetCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Генерируем код сброса пароля
    const resetCode = generateResetCode();

    // Сохраняем код в базе данных
    await prisma.$transaction(async (prisma) => {
      // Помечаем все предыдущие коды как использованные
      await prisma.passwordReset.updateMany({
        where: { 
          userId: user.id,
          used: false
        },
        data: { used: true }
      });

      // Создаем новый код
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: resetCode, // Используем поле token для хранения кода
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 час
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Reset code has been generated',
      resetCode
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 