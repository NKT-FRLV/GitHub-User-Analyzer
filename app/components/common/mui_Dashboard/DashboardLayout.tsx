'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  List,
  useTheme,
  styled,
  CssBaseline,
  Collapse,
  useMediaQuery,
  ListItemIcon,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
  isMobile?: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  width: '100%',
  ...(open && !isMobile && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && !isMobile && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  children?: NavigationItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigationItems: NavigationItem[];
}

export default function DashboardLayout({ children, navigationItems }: DashboardLayoutProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  
  const handleSubMenuClick = (path: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isSelected = pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = openSubMenus[item.path];

    return (
      <div key={item.path}>
        <ListItem disablePadding>
          <ListItemButton
            component={hasChildren ? 'div' : Link}
            href={hasChildren ? undefined : item.path}
            selected={isSelected}
            onClick={hasChildren ? () => handleSubMenuClick(item.path) : undefined}
            sx={{ pl: level * 2 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {hasChildren && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {item.children.map(child => renderNavigationItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

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
          // width: drawerWidth,
          width: 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRadius: 0,
            position: isMobile ? 'fixed' : 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: theme.zIndex.drawer,
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navigationItems.map(item => renderNavigationItem(item, 1))}
        </List>
      </Drawer>
      <Main open={open} isMobile={isMobile}>
        {children}
      </Main>
    </Box>
  );
}