import { ProfileDashboard } from './components/ProfileDashboard';
import { ProfileContent } from './components/ProfileContent';
import { Person as PersonIcon, Analytics as AnalyticsIcon, Search as SearchIcon, Info as InfoIcon } from '@mui/icons-material';
import { NavigationItem } from '../components/common/mui_Dashboard/types';

// Теперь это константа без экспорта, используемая только внутри этого файла
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

/**
 * Серверный компонент страницы профиля
 * Использует композицию компонентов для разделения ответственности
 */
export default async function ProfilePage() {
  // Получаем данные пользователя асинхронно
  // В реальном коде здесь можно использовать cookies, headers и другие API Next.js
  // const userData = await getUserProfile();
  

  return (
    <ProfileDashboard navigationItems={navigationItems}>
      <ProfileContent />
    </ProfileDashboard>
  );
} 