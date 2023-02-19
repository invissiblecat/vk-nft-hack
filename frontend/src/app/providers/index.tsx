import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
} from '@vkontakte/vkui';
import React, { useMemo } from 'react';

import { getPlatform } from '../../shared';
import { StoreProvider } from './Store.provider';

export const Providers: React.FC = ({ children }) => {
  const platform = useMemo(() => getPlatform(), []);

  return (
    <ConfigProvider platform={platform}>
      <AdaptivityProvider>
        <StoreProvider>
          <AppRoot>
            {children}
          </AppRoot>
        </StoreProvider>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
