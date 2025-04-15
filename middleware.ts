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
  '/repos'
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
  
  // Создаем response заранее
  const response = NextResponse.next();
  
  // Если пользователь аутентифицирован, устанавливаем заголовок для всех маршрутов
  if (isAuthenticated?.id) {
    response.headers.set('x-user-id', isAuthenticated.id);
  }

  // Проверяем маршруты только для НЕавторизованных
  if (authOnlyPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    if (isAuthenticated) {
      const redirectResponse = NextResponse.redirect(new URL('/', request.url));
      // Копируем заголовки в redirect response
      if (isAuthenticated.id) {
        redirectResponse.headers.set('x-user-id', isAuthenticated.id);
      }
      return redirectResponse;
    }
    return response;
  }
  
  // Проверяем публичные маршруты
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return response;
  }
  
  // Проверяем защищенные маршруты
  if (protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }
  
  return response;
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
    '/repos'
  ]
}; 