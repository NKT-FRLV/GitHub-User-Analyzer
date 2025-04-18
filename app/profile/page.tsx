'use client';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Link as MuiLink,
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Person as PersonIcon, Settings as SettingsIcon, People as PeopleIcon, Star as StarIcon, Analytics as AnalyticsIcon, Search as SearchIcon, Notifications as NotificationsIcon, GitHub as GitHubIcon, Info as InfoIcon } from '@mui/icons-material';
import DashboardLayout, { NavigationItem } from '../components/common/mui_Dashboard/DashboardLayout';
// import { getCandidates } from '@/app/api/utils/candidate';  
import { ProfileClient } from './common/ProfileClient';
import { DeleteCandidateButton } from './DeleteCandidateButton';
import { redirect } from 'next/navigation';
import { ProfileSkeleton } from './ProfileSkeleton';
import { Candidate } from '@prisma/client';

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
  // {
  //   text: 'Candidates',
  //   icon: <PeopleIcon />,
  //   path: '/candidates',
  //   children: [
  //     { text: 'Saved', icon: <StarIcon />, path: '/candidates/saved' },
  //     { text: 'Favorites', icon: <StarIcon />, path: '/candidates/favorites' },
  //   ]
  // },
  {
    text: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/',
    children: [
      { text: 'Search', icon: <SearchIcon />, path: '/' },
    ]
  },
  // {
  //   text: 'Settings',
  //   icon: <SettingsIcon />,
  //   path: '/settings',
  //   children: [
  //     { text: 'Account', icon: <PersonIcon />, path: '/settings/account' },
  //     { text: 'Notifications', icon: <NotificationsIcon />, path: '/settings/notifications' },
  //     { text: 'Integrations', icon: <GitHubIcon />, path: '/settings/integrations' },
  //   ]
  // },  
];

const ProfilePage = () => {
  const { user, logout, updateAvatar } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await fetch('/api/candidates');
      const { success, candidates } = await response.json();
      if (success) {
        setCandidates(candidates);
      }
    };
    fetchCandidates();
  }, []);

  
  if (!user) {
    redirect('/auth/login');
  }

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
              <ProfileClient user={user} logout={logout} updateAvatar={updateAvatar} />
            </Suspense>

            {/* Candidates Section - Server Component */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Saved Candidates
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {candidates.length === 0 ? (
                    <Typography color="text.secondary">
                      No saved candidates yet
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>GitHub Username</TableCell>
                            <TableCell>Saved Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                              <TableCell>
                                <Avatar
                                  src={candidate.avatarUrl}
                                  alt={candidate.githubName}
                                  sx={{ width: 40, height: 40 }}
                                />
                              </TableCell>
                              <TableCell>
                                <MuiLink
                                  href={candidate.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <GitHubIcon fontSize="small" />
                                  {candidate.githubName}
                                </MuiLink>
                              </TableCell>
                              <TableCell>
                                {format(new Date(candidate.savedAt), 'dd MMMM yyyy', { locale: ru })}
                              </TableCell>
                              <TableCell align="right">
                                <DeleteCandidateButton candidateId={candidate.id} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </DashboardLayout>
  );
}

export default ProfilePage; 