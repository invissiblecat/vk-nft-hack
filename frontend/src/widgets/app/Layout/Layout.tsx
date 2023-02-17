import { Panel, PanelHeader } from '@vkontakte/vkui';
import React from 'react';

import { AppNav } from '../AppNav';

interface LayputProps {
  nav: string
}

export const Layout: React.FC<LayputProps> = ({ children, nav }) => {
  return (
    <Panel nav={nav}>
      <PanelHeader>
        <AppNav />
      </PanelHeader>
      {children}
    </Panel>
  );
};
