import { Group, SimpleCell, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { Loader } from '../features';
import { useCollectionRequest, useStores } from '../shared';
import { CreateCollectionForm, CreateContentForm } from '../widgets';

export const CreatePage: React.FC = observer(() => {
  const { collectionAddressStore } = useStores();

  useCollectionRequest();

  return (
    <>
      <Group>
        <Loader isLoading={collectionAddressStore.isLoading}>
          <SimpleCell disabled>
            <Title level="2">
              {collectionAddressStore.data ? (
                'Создание NFT'
              ) : (
                'Перед созданием NFT необходимо создать коллекцию'
              )}
            </Title>
          </SimpleCell>
          {collectionAddressStore.data ? (
            <CreateContentForm />
          ) : (
            <CreateCollectionForm />
          )}
        </Loader>
      </Group>
    </>
  );
});
