import React, { useState, Suspense } from 'react';
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
import styles from '../reset-password.module.css';
import KeyIcon from '@mui/icons-material/Key';
import Avatar from '@mui/material/Avatar';



function ResetPasswordContent({ token }: { token: string }) {
  const router = useRouter();
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password has been successfully reset');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred while resetting password');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={styles.container}>
      <Paper elevation={2} className={styles.paper}>
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
            <KeyIcon sx={{ color: theme.palette.primary.main }} />
          </Avatar>
          
          <Typography component="h1" variant="h5" className={styles.title}>
            Set New Password
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
          
          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Box className={styles.links}>
              <Link 
                href="/auth/login" 
                className={styles.neonLink}
                passHref
                aria-label="Back to login page"
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default async function ResetPasswordPage({ 
  params 
}: {
  params: { token: string }
}) {
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
      <ResetPasswordContent token={params.token} />
    </Suspense>
  );
} 