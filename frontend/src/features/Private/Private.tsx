import { Icon20Chain } from '@vkontakte/icons';
import { Banner, Button, Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ReactComponent as MetamaskIcon } from '../../app/assets/metamask.svg';
import { useStores } from '../../shared';

export const Private: React.FC = observer(({ children }) => {
  const { walletStore } = useStores();

  return (
    <>
      {walletStore.data && children}
      {!walletStore.data && (
        <Group>
          <Banner
            before={<MetamaskIcon width={60} height="auto" />}
            header="Подключите криптокошелёк, чтобы продолжить"
            actions={
              <Button before={<Icon20Chain />} size="m" onClick={() => walletStore.activate()}>
                Подключить
              </Button>
            }
          />
        </Group>
      )}
    </>
  );
});
