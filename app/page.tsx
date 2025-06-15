import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getCandidateData } from './api/API';
import ClientPage from './ClientPage';

/**
 * Компонент страницы, который вызывается при посещении главной страницы
 */
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const { search } = await searchParams; // github username // NKT-FRLV for example
  
  // Параллельно запускаем получение заголовков и данных пользователя
  const [headersList, initialUser] = await Promise.all([
    headers(),
    getCandidateData(search || 'NKT-FRLV'),
  ]);
  // console.log('user initial', initialUser)
  
  // Определяем мобильное устройство
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /Mobi|Android/i.test(userAgent);

  return (
    <Suspense>
      <ClientPage initialUser={initialUser} isMobile={isMobile} />
    </Suspense>
  );
}