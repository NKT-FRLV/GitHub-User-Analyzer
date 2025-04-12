"use client";

import { useState } from 'react';
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem,
  // useMediaQuery,
  Button 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import { AuthUser } from '../../types/github';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  initialUser: AuthUser | null;
}

const UserMenu = ({ initialUser }: UserMenuProps) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentUser = user || initialUser;
  
  // Check if the user is on the authentication page
  const isAuthPage = pathname.startsWith('/auth/');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    router.push('/auth/login');
    handleClose();
  };

  const handleRegister = () => {
    router.push('/auth/register');
    handleClose();
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push('/');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // If the user is on the authentication page, show the "Home Page" button
  if (isAuthPage) {
    return (
      <Button 
        color="inherit" 
        size="small"
        onClick={handleGoHome}
        startIcon={<HomeIcon />}
        sx={{ textTransform: 'none' }}
      >
        Home Page
      </Button>
    );
  }

  // Otherwise, display the standard user menu
  return (
    <>
      {currentUser?.isAuthenticated ? (
        <>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {currentUser.avatarUrl ? (
              <Avatar src={currentUser.avatarUrl} alt={currentUser.username} />
            ) : (
              <Avatar>
                {currentUser.username.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <IconButton
            aria-label="authentication"
            aria-controls="menu-auth"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <PersonIcon />
          </IconButton>
          <Menu
            id="menu-auth"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogin}>Login</MenuItem>
            <MenuItem onClick={handleRegister}>Register</MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default UserMenu; 