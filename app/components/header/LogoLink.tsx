"use client";

import { useRepoStore } from '@/app/store/repos/store';
import Link from 'next/link';

interface LogoLinkProps {
    textLogo: string;
}

const LogoLink = ({ textLogo = 'GitHub User Analyzer' }: LogoLinkProps) => {

    const githubUsername = useRepoStore((state) => state.githubUsername);
  
  // Если есть параметр search, добавляем его к ссылке
  const href = githubUsername ? `/?search=${githubUsername}` : '/';

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      {textLogo}
    </Link>
  );
};

export default LogoLink; 