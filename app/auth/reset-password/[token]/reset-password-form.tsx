import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation';
import styles from './reset-password.module.css';

interface ResetPasswordFormProps {
    token: string;
    setError: Dispatch<SetStateAction<string>>
    setSuccess: Dispatch<SetStateAction<string>>
}

const ResetPasswordForm = ({ token, setError, setSuccess }: ResetPasswordFormProps) => {
    console.log('hello');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

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
            
          </Box>
  )
}

export default ResetPasswordForm;
