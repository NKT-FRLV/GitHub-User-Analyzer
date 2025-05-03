import { IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AuthUser } from '../../types/github';
import { useState, useEffect } from 'react';
import { useAnimationStore } from '@/app/store/animation-events/store';
import styles from './header.module.css';

interface AuthenticatedMenuProps {
  user: AuthUser;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const AuthenticatedMenu = ({
  user,
  anchorEl,
  open,
  onClose,
  onLogout,
  onMenuClick,
}: AuthenticatedMenuProps) => {
  const router = useRouter();
  
  const isAnimating = useAnimationStore((state) => state.isAnimating);


  const handleProfile = () => {
    router.push('/profile');
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onMenuClick}
        color="inherit"
        size="small"
      >
        {user.avatarUrl ? (
          <Avatar 
            src={user.avatarUrl} 
            alt={user.username} 
            className={isAnimating ? styles.avatarSpringAnimation : ''}
          />
        ) : (
          <Avatar
            className={isAnimating ? styles.avatarSpringAnimation : ''}
          >
            {user.username.charAt(0).toUpperCase()}
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
        onClose={onClose}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default AuthenticatedMenu; 