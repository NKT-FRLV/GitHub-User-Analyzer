
import { getUserFromCookie } from '../api/utils/auth';
import { AuthProvider } from '../context/AuthContext';

export async function AuthProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Получаем пользователя на сервере
  const initialUser = await getUserFromCookie();
  console.log('Initial User _from Cookie_ to AuthProvider: ', initialUser);

  // Гидратируем клиентский AuthProvider начальными данными
  return (
    <AuthProvider initialUser={initialUser}>
      {children}
    </AuthProvider>
  );
} 