import React from 'react';
import { useMediaQuery } from '@mui/material';
import { useRepoStore } from '../store/repos/store';
import { SelectedPage as PageType } from '../store/repos/types';



export const withCondition = (
  page: PageType,
  WrappedComponent: React.ComponentType<any>
): React.FC<any> => {
  return function ConditionalComponent(props) {
    const isSmallScreen = useMediaQuery('(max-width: 950px)');
    const selectedPage = useRepoStore(state => state.selectedPage);

    const shouldShow =
    ((isSmallScreen && selectedPage === page) || !isSmallScreen)

    return shouldShow ? <WrappedComponent {...props} /> : null;
  };
};
