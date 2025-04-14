import { IconButton, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';

interface GuestMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const GuestMenu = ({
  anchorEl,
  open,
  onClose,
  onMenuClick
}: GuestMenuProps) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/login');
    onClose();
  };

  const handleRegister = () => {
    router.push('/auth/register');
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label="authentication"
        aria-controls="menu-auth"
        aria-haspopup="true"
        onClick={onMenuClick}
        color="inherit"
        size="small"
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
        onClose={onClose}
      >
        <MenuItem onClick={handleLogin}>Login</MenuItem>
        <MenuItem onClick={handleRegister}>Register</MenuItem>
      </Menu>
    </>
  );
};

export default GuestMenu; 