'use client';

import { ReactNode } from 'react';
import DashboardLayout from '../../components/common/mui_Dashboard/DashboardLayout';
import type { NavigationItem } from '../../components/common/mui_Dashboard/types';

interface ProfileDashboardProps {
  children: ReactNode;
  navigationItems: NavigationItem[];
}

/**
 * Кастомный компонент дашборда для профиля
 * Обертка над существующим DashboardLayout с дополнительными настройками для профиля
 */
export const ProfileDashboard = ({
  children,
  navigationItems,
}: ProfileDashboardProps) => {
  return (
    <DashboardLayout navigationItems={navigationItems}>
      {children}
    </DashboardLayout>
  );
}; 