
import { Suspense } from 'react';
import { 
  Container, 
  Typography,
  Grid,
} from '@mui/material';
import { Person as PersonIcon, Analytics as AnalyticsIcon, Search as SearchIcon, Info as InfoIcon } from '@mui/icons-material';
import DashboardLayout, { NavigationItem } from '../components/common/mui_Dashboard/DashboardLayout';
import { ProfileClient } from './common/ProfileClient';
import { ProfileSkeleton } from './common/ProfileSkeleton';
import Candidates from './candidate-list/Candidates';

const navigationItems: NavigationItem[] = [
  {
    text: 'Profile',
    icon: <PersonIcon />,
    path: '/profile',
    children: [
      { text: 'User Info', icon: <InfoIcon />, path: '/profile' },
      // { text: 'Settings', icon: <SettingsIcon />, path: '/profile/settings' },
    ]
  },
  {
    text: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/',
    children: [
      { text: 'Search', icon: <SearchIcon />, path: '/' },
    ]
  },
];

const ProfilePage = () => {
  
  // if (!user) {
  //   redirect('/auth/login');
  // }

  return (
      <DashboardLayout navigationItems={navigationItems}>
        <Container maxWidth="md" component="main">
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
            {/* Profile section - Client Component */}
            <Suspense fallback={<ProfileSkeleton />}>
              <ProfileClient />
            </Suspense>
            {/* Candidates List - Client Component */}
            <Candidates />

          </Grid>
        </Container>
      </DashboardLayout>
  );
}

export default ProfilePage; 