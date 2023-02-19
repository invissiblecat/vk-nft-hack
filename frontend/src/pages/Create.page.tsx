import { Group, Headline, SimpleCell, Spacing, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { Loader } from '../features';
import { useCollectionRequest, useStores } from '../shared';
import { CreateCollectionForm, CreateContentForm } from '../widgets';

export const CreatePage: React.FC = observer(() => {
  const { collectionAddressStore } = useStores();

  useCollectionRequest();

  return (
    <Group>
      <Loader isLoading={collectionAddressStore.isLoading}>
        <SimpleCell disabled>
          <Title level="2">
            {collectionAddressStore.data ? (
              'Создать NFT'
            ) : (
              'Создать коллекцию NFT'
            )}
          </Title>
          <Spacing size={8} />
          <Headline style={{ whiteSpace: 'initial' }} level="2">
            {collectionAddressStore.data ? (
              'NFT содаётся один раз и навсегда, изменить значения полей невозможно, будте внимательней!'
            ) : (
              'Каждый NFT принадлежит коллекции, прежде чем создать свой первый NFT, необходимо создать коллекцию.'
            )}
          </Headline>
        </SimpleCell>
        {collectionAddressStore.data ? (
          <CreateContentForm />
        ) : (
          <CreateCollectionForm />
        )}
      </Loader>
    </Group>
  );
});
