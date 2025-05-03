import { Suspense } from 'react';
import { 
  Container, 
  Typography,
  Grid
} from '@mui/material';
import { ProfileClient } from './ProfileClient';
import { ProfileSkeleton } from '../common/ProfileSkeleton';
import { CandidatesSection } from './CandidatesSection';

/**
 * Компонент для отображения содержимого профиля
 * Разделяет ответственность между серверными и клиентскими компонентами
 */
export const ProfileContent = () => {
  return (
    <Container maxWidth="md" component="div">
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          my: 2, 
          fontWeight: 600,
          color: 'text.primary',
          textAlign: 'center' 
        }}
      >
        User Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile section - Client Component wrapped in Suspense */}
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileClient />
        </Suspense>
        
        {/* Candidates List section */}
        <CandidatesSection />
      </Grid>
    </Container>
  );
}; 