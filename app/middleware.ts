import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from './api/utils/auth';

// Пути, которые не требуют аутентификации
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Разрешаем доступ к API маршрутам (они сами проверяют аутентификацию)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Разрешаем доступ к публичным путям
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }
  
  // Проверяем наличие токена
  // Используем cookies из request, а не из next/headers, так как в middleware контекст другой
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    // Перенаправляем на страницу входа
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // Проверяем валидность токена
  const userData = await verifyJWT(token);
  
  if (!userData) {
    // Токен недействителен, перенаправляем на страницу входа
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // Токен действителен, разрешаем доступ
  return NextResponse.next();
}

// Настраиваем пути, которые обрабатывает middleware
export const config = {
  matcher: [
    /*
     * Матчим все пути, кроме:
     * - Файлов с расширениями (статические файлы)
     * - API маршрутов (/api/auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
} 