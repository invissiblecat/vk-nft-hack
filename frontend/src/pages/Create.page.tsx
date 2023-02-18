import { Group, SimpleCell, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { ChainId } from '../app/enums';
import { Loader } from '../features';
import { CONTENT_ROOT_ADDRESSES_MAP, useStores } from '../shared';
import { CreateCollectionForm, CreateContentForm } from '../widgets';

export const CreatePage: React.FC = observer(() => {
  const { /* userStore, snackbarStore, */ collectionStore, userStore } = useStores();

  useEffect(() => {
    // if (!userStore.data) return;

    collectionStore.activate({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      vkId: 67135042,
      // vkId: userStore.data.id,
    });

    return () => collectionStore.deactivate();
  }, [collectionStore, userStore.data]);

  return (
    <>
      <Group>
        <Loader isLoading={collectionStore.isLoading}>
          <SimpleCell disabled>
            <Title level="2">
              {collectionStore.data ? (
                'Создание NFT'
              ) : (
                'Перед созданием NFT необходимо создать коллекцию'
              )}
            </Title>
          </SimpleCell>
          {collectionStore.data ? (
            <CreateContentForm />
          ) : (
            <CreateCollectionForm />
          )}
        </Loader>
      </Group>
    </>
  );
});
