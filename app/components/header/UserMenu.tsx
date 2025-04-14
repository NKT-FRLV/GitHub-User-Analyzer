"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthUser } from '../../types/github';
import { useAuth } from '../../context/AuthContext';
import HomeButton from './HomeButton';
import AuthenticatedMenu from './AuthenticatedMenu';
import GuestMenu from './GuestMenu';

interface UserMenuProps {
  initialUser: AuthUser | null;
}

const UserMenu = ({ initialUser }: UserMenuProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentUser = user || initialUser;
  const isAuthPage = pathname.startsWith('/auth/');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (isAuthPage) {
    return <HomeButton />;
  }

  if (currentUser?.isAuthenticated) {
    return (
      <AuthenticatedMenu
        user={currentUser}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onLogout={handleLogout}
        onMenuClick={handleMenu}
        profileUrl={`/profile?userId=${currentUser.id}`}
      />
    );
  }

  return (
    <GuestMenu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onMenuClick={handleMenu}
    />
  );
};

export default UserMenu; 