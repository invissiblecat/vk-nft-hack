import { Epic, Structure } from '@cteamdev/router';
import {
  SplitCol,
  SplitLayout,
  useAdaptivity,
  ViewWidth,
} from '@vkontakte/vkui';
import React, { ReactNode, useMemo } from 'react';

import { Snackbar } from '../../../entities';
import { Popouts } from '../../../popouts';
import { ModalRoot } from '../../modal';

interface NavigationProps {
  children: ReactNode
}

export const Navigation: React.FC<NavigationProps> = ({ children }: NavigationProps) => {
  const { viewWidth } = useAdaptivity();
  const isDesktop = useMemo(() => (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET, [viewWidth]);

  return (
    <Structure>
      <SplitLayout
        style={{ justifyContent: 'center' }}
        modal={<ModalRoot />}
        popout={<Popouts />}
      >
        <SplitCol
          animate={!isDesktop}
          width={isDesktop ? '650px' : '100%'}
          maxWidth={isDesktop ? '650px' : '100%'}
        >
          <Epic>
            {children}
          </Epic>
          <Snackbar isDesktop={isDesktop} />
        </SplitCol>
      </SplitLayout>
    </Structure>
  );
};
