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
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Candidate } from '../types/github';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await fetch('/api/candidates');
      const data = await response.json();
      
      if (data.success) {
        setCandidates(data.candidates);
      } else {
        setError(data.message || 'Ошибка при получении списка кандидатов');
      }
    } catch (error) {
      console.error('Ошибка при получении кандидатов:', error);
      setError('Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого кандидата?')) {
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
        setError(data.message || 'Ошибка при удалении кандидата');
      }
    } catch (error) {
      console.error('Ошибка при удалении кандидата:', error);
      setError('Произошла ошибка при удалении кандидата');
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user?.isAuthenticated) {
    return null; // Перенаправление произойдет в useEffect
  }

  return (
    <Container component="main" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Сохраненные кандидаты
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Здесь отображаются GitHub-профили, которые вы сохранили для дальнейшего рассмотрения
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper elevation={2} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : candidates.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography>У вас пока нет сохраненных кандидатов</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => router.push('/')}
          >
            Найти кандидатов
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
                  subheader={`Сохранено: ${format(new Date(candidate.savedAt), 'dd MMMM yyyy', { locale: ru })}`}
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
                    GitHub-профиль кандидата для рассмотрения на позицию разработчика.
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Button 
                    size="small" 
                    startIcon={<GitHubIcon />}
                    onClick={() => window.open(candidate.githubUrl, '_blank')}
                  >
                    Открыть GitHub
                  </Button>
                  <IconButton 
                    aria-label="удалить" 
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
  );
} 