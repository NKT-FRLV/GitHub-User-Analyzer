"use client";

import { useEffect, useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Grid,
  CssBaseline,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { AccountCircle as AccountCircleIcon, PhotoCamera, Edit } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, updateAvatar } = useAuth();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    // If the user is not authenticated and loading is complete, redirect to login
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // When the component mounts or user updates, we set the current avatar URL (if any)
  useEffect(() => {
    if (user?.avatarUrl) {
      console.log('Setting avatar from user data:', user.avatarUrl);
      setAvatarUrl(user.avatarUrl);
    } else {
      console.log('Avatar not found in user data:', user);
    }
  }, [user]);

  // Additional authentication check on mounting
  useEffect(() => {
    if (user && user.isAuthenticated) {
      console.log('Authenticated user:', user);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAvatarUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(event.target.value);
  };

  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) {
      setSnackbar({
        open: true,
        message: 'Avatar URL cannot be empty',
        severity: 'error'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const success = await updateAvatar(avatarUrl);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Avatar successfully updated',
          severity: 'success'
        });
        handleCloseDialog();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update avatar',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the avatar',
        severity: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  if (!user) {
    return null; // Will be redirected in useEffect
  }

  return (
    <>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          bgcolor: 'background.default',
        }}
      >
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
            {/* Profile card with avatar */}
            <Grid item xs={12} md={4}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    flexGrow: 1,
                    position: 'relative'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    {user.avatarUrl ? (
                      <Avatar 
                        src={user.avatarUrl} 
                        alt={`${user.username}'s avatar`}
                        sx={{ 
                          width: { xs: 80, md: 120 }, 
                          height: { xs: 80, md: 120 }, 
                          mb: 2 
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{ 
                          width: { xs: 80, md: 120 }, 
                          height: { xs: 80, md: 120 }, 
                          mb: 2,
                          bgcolor: 'primary.main'
                        }}
                      >
                        <AccountCircleIcon sx={{ fontSize: { xs: 60, md: 80 } }} />
                      </Avatar>
                    )}
                    <Tooltip title="Change avatar">
                      <IconButton 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 8, 
                          right: -8,
                          bgcolor: 'background.paper', 
                          '&:hover': { bgcolor: 'action.hover' } 
                        }}
                        onClick={handleOpenDialog}
                        aria-label="Change avatar"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleLogout}
                    aria-label="Logout from account"
                  >
                    Logout
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* User information card */}
            <Grid item xs={12} md={8}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  p: 3
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  User Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle2" color="text.secondary">
                          Username
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {user.username}
                        </Typography>
                      }
                      disableTypography
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {user.email}
                        </Typography>
                      }
                      disableTypography
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle2" color="text.secondary">
                          ID
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {user.id}
                        </Typography>
                      }
                      disableTypography
                    />
                  </ListItem>
                </List>
                
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Activity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" color="text.secondary">
                    Here is no activity data. In future versions, this will display a history of searches and saved GitHub profiles.
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dialog for changing avatar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="avatar-dialog-title">
        <DialogTitle id="avatar-dialog-title">Edit avatar</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="avatar-url"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={avatarUrl}
            onChange={handleAvatarUrlChange}
            placeholder="For example, https://i.imgur.com/example.jpg"
            helperText={
              <>
                Enter the URL of the image to use as an avatar. 
                <br />
                Examples: imgur.com, cloudinary.com, googleusercontent.com
              </>
            }
            InputProps={{
              startAdornment: <PhotoCamera sx={{ color: 'action.active', mr: 1 }} />,
            }}
            error={avatarUrl.length > 0 && !isValidUrl(avatarUrl)}
          />
          {avatarUrl && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Avatar 
                src={avatarUrl} 
                alt="Preview" 
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '2px solid',
                  borderColor: 'divider'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateAvatar} 
            color="primary" 
            variant="contained"
            disabled={isUpdating || !avatarUrl.trim() || !isValidUrl(avatarUrl)}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
} 