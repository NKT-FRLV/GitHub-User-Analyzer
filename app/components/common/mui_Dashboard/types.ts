import { ReactNode } from 'react';

export interface NavigationItem {
  text: string;
  icon: ReactNode;
  path: string;
  children?: NavigationItem[];
}

export interface DashboardLayoutProps {
  children: ReactNode;
  navigationItems: NavigationItem[];
} 