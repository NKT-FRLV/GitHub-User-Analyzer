import {
  ListItemIcon,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
  Collapse,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import Link from 'next/link';
import { NavigationItem } from './types';

interface NavigationListItemProps {
  item: NavigationItem;
  level?: number;
  openSubMenus: Record<string, boolean>;
  onSubMenuClick: (path: string) => void;
  currentPath: string;
}

const NavigationListItem = ({
  item,
  level = 0,
  openSubMenus,
  onSubMenuClick,
  currentPath,
}: NavigationListItemProps) => {
  const isSelected = currentPath === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const isSubMenuOpen = openSubMenus[item.path];

  return (
    <div key={item.path}>
      <ListItem disablePadding>
        <ListItemButton
          component={hasChildren ? 'div' : Link}
          href={hasChildren ? undefined : item.path}
          selected={isSelected}
          onClick={hasChildren ? () => onSubMenuClick(item.path) : undefined}
          sx={{ pl: level * 2 }}
          aria-expanded={hasChildren ? isSubMenuOpen : undefined}
          aria-current={isSelected ? 'page' : undefined}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          {hasChildren && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map(child => (
              <NavigationListItem
                key={child.path}
                item={child}
                level={level + 1}
                openSubMenus={openSubMenus}
                onSubMenuClick={onSubMenuClick}
                currentPath={currentPath}
              />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  );
};

export default NavigationListItem; 