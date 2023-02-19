import { styled } from '@mui/material';
import { Icon20DoorArrowRightOutline } from '@vkontakte/icons';
import { IconButton, Panel, PanelHeader } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStores } from '../../../shared';
import { AppNav } from '../AppNav';

const StyledPanelHeader = styled(PanelHeader)(() => ({
  '& > .PanelHeader__in > .PanelHeader__after': {
    minWidth: 50,
  },
}));

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

interface LayputProps {
  nav: string
}

export const Layout: React.FC<LayputProps> = observer(({ children, nav }) => {
  const { walletStore } = useStores();
  return (
    <Panel nav={nav}>
      <StyledPanelHeader>
        <AppNav />
        {walletStore.data && (
          <StyledLogoutButton>
            <Icon20DoorArrowRightOutline onClick={() => walletStore.deactivate()} />
          </StyledLogoutButton>
        )}
      </StyledPanelHeader>
      {children}
    </Panel>
  );
});
