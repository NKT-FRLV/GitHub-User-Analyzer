import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getCandidateData } from './api/API';
import ClientPage from './ClientPage';

/**
 * Компонент страницы который вызывается когда кто то посещает главную страницу
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts}
 */
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) {
  // начальные данные
  let initialUser = null;

  // Проверяем мобильный браузер
  const userAgent = (await headers()).get('user-agent') || '';
  const isMobile = /Mobi|Android/i.test(userAgent);

  const params = await searchParams;

  if (params?.search) {
    initialUser = await getCandidateData(params.search);
  } else {
    // дефолтный юзер
    initialUser = await getCandidateData('NKT-FRLV');
  }

  return (
    <Suspense>
      <ClientPage initialUser={initialUser} isMobile={isMobile} />
    </Suspense>
  );
}
