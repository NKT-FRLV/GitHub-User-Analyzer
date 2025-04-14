import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode, password } = await request.json();

    if (!email || !resetCode || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, reset code and password are required' },
        { status: 400 }
      );
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Проверяем существование кода в базе данных
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        token: resetCode,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    // Хешируем новый пароль
    const { hash, salt } = await hashPassword(password);

    // Обновляем пароль пользователя
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hash,
        salt
      }
    });

    // Помечаем код как использованный
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 