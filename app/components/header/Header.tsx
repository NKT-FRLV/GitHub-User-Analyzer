import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box
} from '@mui/material';
import Link from 'next/link';
import styles from './header.module.css';
import UserMenu from './UserMenu';

/**
 * Серверный компонент Header
 * UserMenu импортируется как клиентский компонент с логикой авторизации
 */
export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a', borderRadius: 0 }}>
      <Toolbar sx={{ py: 1 }} className={styles.toolbar}>
        <Typography 
          variant="h6" 
          component="div" 
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