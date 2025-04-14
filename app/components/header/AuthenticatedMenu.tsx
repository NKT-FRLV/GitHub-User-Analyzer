import { IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AuthUser } from '../../types/github';

interface AuthenticatedMenuProps {
  user: AuthUser;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  profileUrl: string;
}

const AuthenticatedMenu = ({
  user,
  anchorEl,
  open,
  onClose,
  onLogout,
  onMenuClick,
  profileUrl
}: AuthenticatedMenuProps) => {
  const router = useRouter();

  const handleProfile = () => {
    router.push(profileUrl);
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
          <Avatar src={user.avatarUrl} alt={user.username} />
        ) : (
          <Avatar>
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