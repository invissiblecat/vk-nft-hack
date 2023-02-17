import { Icon56GhostOutline } from '@vkontakte/icons';
import { Group, Placeholder } from '@vkontakte/vkui';
import React from 'react';

export const Info: React.FC = () => {
  return (
    <>
      <Group>
        <Placeholder
          icon={<Icon56GhostOutline />}
        >
          Здесь ничего нет!
        </Placeholder>
      </Group>
    </>
  );
};
