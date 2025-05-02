import { ProfileDashboard } from './components/ProfileDashboard';
import { ProfileContent } from './components/ProfileContent';
import { Person as PersonIcon, Analytics as AnalyticsIcon, Search as SearchIcon, Info as InfoIcon } from '@mui/icons-material';
import { NavigationItem } from '../components/common/mui_Dashboard/DashboardLayout';

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
 * Асинхронная функция для получения данных пользователя (заглушка)
 * В реальном приложении здесь будет запрос к API
 */
async function getUserProfile() {
  // Имитируем задержку запроса к API
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    // Возвращаем данные профиля
  };
}

/**
 * Серверный компонент страницы профиля
 * Использует композицию компонентов для разделения ответственности
 */
export default async function ProfilePage() {
  // Получаем данные пользователя асинхронно
  // В реальном коде здесь можно использовать cookies, headers и другие API Next.js
  // const userData = await getUserProfile();
  
  // Проверка авторизации может быть выполнена здесь
  // if (!userData) {
  //   redirect('/auth/login');
  // }

  return (
    <ProfileDashboard navigationItems={navigationItems}>
      <ProfileContent />
    </ProfileDashboard>
  );
} 