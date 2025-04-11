"use client";

import React, { useState, useEffect, Suspense } from 'react';
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

function RegisterContent() {
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
      setError('All fields are required');
      return false;
    }
    
    if (credentials.password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError('Enter a valid email');
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
        setError('User with this name already exists');
      }
    } catch (err) {
      setError('An error occurred while registering');
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
            Registration
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
              label="Username"
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
              label="Password"
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
              label="Confirm password"
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
              {loading ? 'Registration...' : 'Register'}
            </Button>
            <Box className={styles.links}>
              <Link 
                href="/auth/login" 
                className={styles.neonLink} 
                passHref 
                aria-label="Go to the login page"
              >
                Already have an account? Login
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
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexGrow: 1 
      }}>
        <CircularProgress color="primary" />
      </Box>
    }>
      <RegisterContent />
    </Suspense>
  );
} 