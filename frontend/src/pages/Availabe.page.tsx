import { push } from '@cteamdev/router';
import { Button, Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Route } from '../app/enums';
import { Loader } from '../features';
import { useStores } from '../shared';
import { ContentItem } from '../widgets';
import { EmptyPage } from './Empty.page';

export const AvailablePage: React.FC = observer(() => {
  const { contentListStore, contentStore } = useStores();

  useEffect(() => {
    contentListStore.activate({ available: true });

    return () => contentListStore.deactivate();
  }, [contentListStore]);

  return (
    <Group>
      <Loader isLoading={contentListStore.isLoading}>
        <EmptyPage
          isEmpty={!contentListStore.data || !contentListStore.data.length}
          action={
            <Button onClick={() => push(Route.ROOT)}>
              Выбрать NFT
            </Button>
            }
        >
          {!!contentListStore.data?.length && contentListStore.data.map((content) => (
            <ContentItem
              key={content.tokenId + content.nftCollection.collectionAddress}
              content={content}
              onClick={() => {
                push(Route.NFT);
                contentStore.activate({
                  tokenId: content.tokenId,
                  collectionAddress: content.nftCollection.collectionAddress,
                });
              }}
            />
          ))}
        </EmptyPage>
      </Loader>
    </Group>
  );
});
