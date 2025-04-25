"use client";

import { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  CardHeader,
  IconButton,
  Avatar
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Candidate } from '../../types/github';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import FullPageLoader from '@/app/components/common/FullPageLoader';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Перенаправляем неавторизованных пользователей
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?from=/candidates');
    }
  }, [user, authLoading, router]);

  // Получаем список кандидатов
  useEffect(() => {
    if (user?.isAuthenticated) {
      fetchCandidates();
    }
  }, [user]);

  const fetchCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const response = await fetch('/api/candidates');
      const data = await response.json();
      
      if (data.success) {
        setCandidates(data.candidates);
      } else {
        setError(data.message || 'Error fetching candidates list');
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('An error occurred while loading data');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/candidates', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Обновляем список кандидатов
        setCandidates(candidates.filter(c => c.id !== candidateId));
      } else {
        setError(data.message || 'Error deleting candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setError('An error occurred while deleting candidate');
    }
  };

  if (!user?.isAuthenticated) {
    return null; // Перенаправление произойдет в useEffect
  }

  return (
    <>
      <FullPageLoader open={authLoading} />
      <Container component="main" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
          Saved candidates
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Here you can see GitHub profiles that you have saved for further consideration
        </Typography>
      </Paper>

      {loadingCandidates ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper elevation={2} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : candidates.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography>You have no saved candidates yet</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => router.push('/')}
          >
            Find candidates
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {candidates.map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate.id}>
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar src={candidate.avatarUrl} alt={candidate.githubName} />
                  }
                  title={candidate.githubName}
                  subheader={`Saved: ${format(new Date(candidate.savedAt), 'dd MMMM yyyy', { locale: ru })}`}
                />
                <CardMedia
                  component="img"
                  height="140"
                  image={candidate.avatarUrl}
                  alt={candidate.githubName}
                  sx={{ objectFit: 'contain', bgcolor: 'grey.100' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    GitHub profile of the candidate for consideration for the developer position.
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Button 
                    size="small" 
                    startIcon={<GitHubIcon />}
                    onClick={() => window.open(candidate.githubUrl, '_blank')}
                  >
                    Open GitHub
                  </Button>
                  <IconButton 
                    aria-label="delete" 
                    sx={{ marginLeft: 'auto' }}
                    onClick={() => handleDelete(candidate.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          </Grid>
        )}
      </Container>
    </>
  );
} 