import { Icon20CrownCircleFillVkDating } from '@vkontakte/icons';
import { CellButton, Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Loader } from '../features';
import { useStores } from '../shared';
import { ContentItem } from '../widgets';

export const NftPage: React.FC = observer((() => {
  const { contentStore } = useStores();

  useEffect(() => {
    return () => contentStore.deactivate();
  }, []);

  return (
    <Group>
      <Loader isLoading={contentStore.isLoading}>

        <ContentItem content={contentStore.data} />
      </Loader>
      <CellButton
        centered
        before={<Icon20CrownCircleFillVkDating />}
      >
        Получить полный доступ
      </CellButton>
    </Group>
  );
}));
