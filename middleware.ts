import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './app/api/utils/auth';

// Маршруты только для НЕавторизованных пользователей
const authOnlyPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/forgot-password'
];

// Публичные маршруты (доступны всем)
const publicPaths = [
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy'
];

// Защищенные маршруты (требуют авторизации)
const protectedPaths = [
  // Пользовательские маршруты
  '/profile',
  '/profile/settings',
  '/profile/notifications',
  
  // Поиск и результаты
  '/search',
  '/search/history',
  '/search/saved',
  '/search/results',
  
  // GitHub интеграция
  '/github',
  '/github/repositories',
  '/github/stars',
  '/github/following',
  
  // Управление кандидатами
  '/candidates',
  '/candidates/saved',
  '/candidates/archived',
  '/candidates/favorites',
  
  // Аналитика и статистика
  '/analytics',
  '/analytics/search',
  '/analytics/github',
  
  // Настройки
  '/settings',
  '/settings/account',
  '/settings/preferences',
  '/settings/notifications',
  '/settings/integrations'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('middleware');
  
  // Пропускаем API маршруты
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Проверяем токен
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = token ? await verifyJWT(token) : null;
  
  // Проверяем маршруты только для НЕавторизованных
  if (authOnlyPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    if (isAuthenticated) {
      // Если пользователь авторизован - редирект на главную
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return response;
    }
    return NextResponse.next();
  }
  
  // Проверяем публичные маршруты
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }
  
  // Проверяем защищенные маршруты
  if (protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Добавляем user ID в заголовки для серверных компонентов
    const response = NextResponse.next();
    if (isAuthenticated.id) {
      response.headers.set('x-user-id', isAuthenticated.id);
    }
    return response;
  }
  
  return NextResponse.next();
}

// Настраиваем пути, которые обрабатывает middleware
export const config = {
  matcher: [
    // Аутентификация
    '/auth/:path*',
    
    // API маршруты
    '/api/auth/:path*',
    '/api/github/:path*',
    '/api/search/:path*',
    '/api/candidates/:path*',
    '/api/analytics/:path*',
    
    // Защищенные маршруты
    '/profile/:path*',
    '/search/:path*',
    '/github/:path*',
    '/candidates/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    
    // Публичные маршруты
    '/',
    '/about',
    '/contact',
    '/terms',
    '/privacy'
  ]
}; 