import React from 'react';

import { StoreContext } from '../context';
import { rootStore } from '../store';

export const StoreProvider: React.FC = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};
