'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  IconButton,
  Divider,
  List,
  useTheme,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';

// Import components from extracted files
import { DashboardLayoutProps } from './types';
import { Main, DrawerHeader, StyledAppBar, DRAWER_WIDTH } from './StyledComponents';
import NavigationListItem from './NavigationListItem';

export default function DashboardLayout({ children, navigationItems }: DashboardLayoutProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleDrawerOpen = useCallback(() => setOpen(true), []);
  const handleDrawerClose = useCallback(() => setOpen(false), []);
  
  const handleSubMenuClick = useCallback((path: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  }, []);

  const drawerVariant = useMemo(() => isMobile ? "temporary" : "persistent", [isMobile]);

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexGrow: 1 }}>
      <CssBaseline />
      <StyledAppBar 
        position="absolute" 
        sx={{ 
          top: 0, 
          left: 0, 
          height: 'fit-content', 
          borderRadius: '0px 0 25px 0', 
          width: 'fit-content', 
          backgroundColor: '#000' 
        }}  
        open={open}
        isMobile={isMobile}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        sx={{
          width: 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRadius: 0,
            position: isMobile ? 'fixed' : 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: theme.zIndex.drawer,
          },
        }}
        variant={drawerVariant}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton 
            onClick={handleDrawerClose} 
            aria-label="close drawer"
          >
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List aria-label="navigation menu">
          {navigationItems.map(item => (
            <NavigationListItem
              key={item.path}
              item={item}
              level={1}
              openSubMenus={openSubMenus}
              onSubMenuClick={handleSubMenuClick}
              currentPath={pathname}
            />
          ))}
        </List>
      </Drawer>
      <Main open={open} isMobile={isMobile}>
        {children}
      </Main>
    </Box>
  );
}