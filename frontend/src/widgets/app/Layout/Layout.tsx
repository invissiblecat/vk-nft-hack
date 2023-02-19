import { styled } from '@mui/material';
import { Icon20DoorArrowRightOutline } from '@vkontakte/icons';
import { IconButton, Panel, PanelHeader } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStores } from '../../../shared';
import { AppNav } from '../AppNav';

interface LayputProps {
  nav: string
}

const StyledLogoutButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '50%',
  right: 4,
  transform: 'translateY(-50%)',
  padding: 10,
  color: 'var(--header_text_secondary)',
  width: 40,
  height: 40,
}));

export const Layout: React.FC<LayputProps> = observer(({ children, nav }) => {
  const { walletStore } = useStores();
  return (
    <Panel nav={nav}>
      <PanelHeader>
        <AppNav />
        {walletStore.data && (
          <StyledLogoutButton>
            <Icon20DoorArrowRightOutline onClick={() => walletStore.deactivate()} />
          </StyledLogoutButton>
        )}
      </PanelHeader>
      {children}
    </Panel>
  );
});
