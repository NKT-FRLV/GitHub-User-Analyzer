"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import HomeButton from './HomeButton';
import AuthenticatedMenu from './AuthenticatedMenu';
import GuestMenu from './GuestMenu';

// interface UserMenuProps {
//   initialUser: AuthUser | null;
// }

const UserMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // const currentUser = initialUser || user;
  const isAuthPage = pathname.startsWith('/auth/');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    router.push('/');
    logout();
  };

  if (isAuthPage) {
    return <HomeButton />;
  }

  if (user?.isAuthenticated) {
    return (
      <AuthenticatedMenu
        user={user}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onLogout={handleLogout}
        onMenuClick={handleMenu}
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