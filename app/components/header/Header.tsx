import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box
} from '@mui/material';
import Link from 'next/link';
import styles from './header.module.css';
import UserMenu from './UserMenu';
import { prisma } from '@/app/lib/prisma';
import { headers } from 'next/headers';
import { AuthProvider } from '@/app/context/AuthContext';
// import { getUserFromCookie } from '@/app/api/utils/auth';

/**
 * Серверный компонент Header
 * UserMenu импортируется как клиентский компонент с логикой авторизации
 */
export default async function Header() {
  // const initialUser = await getUserFromCookie();
  // const headersList = await headers();
  // const userId = headersList.get('x-user-id');

  // console.log('userId', userId);
  // const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  
  // const authUser =  user ? {
  //   id: user?.id,
  //   username: user?.username,
  //   email: user?.email,
  //   avatarUrl: user?.avatarUrl,
  //   isAuthenticated: true
  // } : null;

  // console.log('authUser', authUser);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a', borderRadius: 0 }}>
      <Toolbar sx={{ py: 1 }} className={styles.toolbar}>
        <Typography 
          variant="h6" 
          component="h1" 
          className={styles.title} 
          sx={{ 
            cursor: 'pointer',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            GitHub User Analyzer
          </Link>
        </Typography>
        
        {/* Меню пользователя (клиентский компонент) */}
        <Box sx={{ ml: 'auto' }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
} 