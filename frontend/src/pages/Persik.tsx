import { back } from '@cteamdev/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelProps,
  Placeholder } from '@vkontakte/vkui';
import React from 'react';

import persikImage from '../app/assets/persik.png';

export const Persik: React.FC<PanelProps> = ({ nav }: PanelProps) => {
  return (
    <Panel nav={nav}>
      <PanelHeader
        left={<PanelHeaderBack onClick={back} />}
      >
        Персик
      </PanelHeader>
      <Group>
        <Placeholder
          icon={<img src={persikImage} width={128} />}
        />
      </Group>
    </Panel>
  );
};
