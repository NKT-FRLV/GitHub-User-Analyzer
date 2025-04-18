"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  // CircularProgress,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { LoginCredentials } from '../../types/github';
import { useAuth } from '../../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FullPageLoader from '../../components/common/FullPageLoader';
import Avatar from '@mui/material/Avatar';
import clsx from 'clsx';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const { login, loading: authLoading } = useAuth();
  console.log('user in login page');
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [mounted, setMounted] = useState(false);

  // Проверяем, есть ли сообщение об успешной регистрации
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registration successful! Now you can login to the system.');
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const success = await login(credentials.username, credentials.password);
      
      if (success) {
        const redirectPath = searchParams.get('from') || '/';
        router.push(redirectPath);
        console.log('redirecting to on SUBMIT', redirectPath);
        return;
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred while logging in');
      console.error('Login error:', err);
    }
    
    setLoading(false);
  };

  return (
    <>
      <FullPageLoader open={loading} />
      <Container
        component="main"
        maxWidth="xs"
        className={clsx(styles.loginContainer, mounted && styles.fadeIn)}
      >
        <Paper elevation={2} className={styles.loginPaper}>
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
              <LockOutlinedIcon sx={{ color: theme.palette.primary.main }} />
            </Avatar>
            
            <Typography component="h1" variant="h5" className={styles.loginTitle}>
              Login to system
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
            
            {success && (
              <Alert 
                severity="success" 
                className={styles.alert}
                sx={{ width: '100%' }}
              >
                {success}
              </Alert>
            )}
            
            <Box
              ref={formRef}
              tabIndex={-1}
              aria-label="Login form"
              component="form"
              onSubmit={handleSubmit}
              className={styles.form }
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                // autoFocus
                value={credentials.username}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
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
                {loading ? 'Loading...' : 'Login'}
              </Button>
              <Box className={styles.links}>
                <Link 
                  href="/auth/register" 
                  className={styles.neonLink} 
                  passHref
                  aria-label="Go to the registration page"
                >
                  No account? Register
                </Link>
                <Link 
                  href="/auth/forgot-password" 
                  className={styles.neonLink} 
                  passHref
                  aria-label="Forgot your password?"
                >
                  Forgot password?
                </Link>
                <Link 
                  href="/" 
                  className={styles.neonLink} 
                  passHref
                  aria-label="Go to the main page"
                >
                  Back to the main page
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <FullPageLoader open={true} />
    }>
      <LoginContent />
    </Suspense>
  );
} 