"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import { RegisterCredentials } from '../../types/github';
import { useAuth } from '../../context/AuthContext';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Avatar from '@mui/material/Avatar';

export default function RegisterPage() {
  const router = useRouter();
  const theme = useTheme();
  const { register, user, loading: authLoading } = useAuth();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Если пользователь уже аутентифицирован, перенаправляем на главную
  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!credentials.username || !credentials.email || !credentials.password) {
      setError('Все поля обязательны для заполнения');
      return false;
    }
    
    if (credentials.password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    
    if (credentials.password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError('Введите корректный email');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const success = await register(
        credentials.username, 
        credentials.email, 
        credentials.password
      );
      
      if (success) {
        router.push('/auth/login?registered=true');
      } else {
        setError('Пользователь с таким именем уже существует');
      }
    } catch (err) {
      setError('Произошла ошибка при регистрации');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        bgcolor: theme.palette.background.default 
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs" className={styles.registerContainer}>
      <Paper elevation={2} className={styles.registerPaper}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: 'rgba(84, 110, 122, 0.1)',
            width: 50,
            height: 50
          }}>
            <PersonAddAltOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          </Avatar>
          
          <Typography component="h1" variant="h5" className={styles.registerTitle}>
            Регистрация
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              className={styles.alert}
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Имя пользователя"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="new-password"
              value={credentials.password}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
            <Box className={styles.links}>
              <Link 
                href="/auth/login" 
                className={styles.neonLink} 
                passHref 
                aria-label="Перейти на страницу входа"
              >
                Уже есть аккаунт? Войти 
              </Link>
              <Link 
                href="/" 
                className={styles.neonLink} 
                passHref
                aria-label="Вернуться на главную страницу"
              >
                Вернуться на главную
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 