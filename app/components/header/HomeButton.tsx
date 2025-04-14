import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

const HomeButton = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

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
};

export default HomeButton; 