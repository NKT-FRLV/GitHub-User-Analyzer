import React from 'react';
import { useMediaQuery } from '@mui/material';
import { useRepoStore } from '../store/repos/store';
import { SelectedPage } from '../store/repos/types';

type WithPageConditionOptions = {
  page: SelectedPage;
};

export function withResponsiveVisibility<P>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPageConditionOptions
): React.FC<P> {
  const { page } = options;

  const ResponsiveComponent: React.FC<P> = (props) => {
    const isSmallScreen = useMediaQuery('(max-width: 950px)');
    const selectedPage = useRepoStore((state) => state.selectedPage);

    const shouldRender =
      (!isSmallScreen) || (isSmallScreen && selectedPage === page);

    return shouldRender ? <WrappedComponent {...props} /> : null;
  };

  ResponsiveComponent.displayName = `withResponsiveVisibility(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ResponsiveComponent;
}