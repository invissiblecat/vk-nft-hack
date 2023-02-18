import { push } from '@cteamdev/router';
import { Button, Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Route } from '../app/enums';
import { Loader } from '../features';
import { useCollectionRequest, useStores } from '../shared';
import { ContentItem } from '../widgets';
import { EmptyPage } from './Empty.page';

export const MyCollectionPage: React.FC = observer(() => {
  const { contentListStore, contentStore, collectionStore } = useStores();

  useCollectionRequest();

  useEffect(() => {
    if (!collectionStore.data) return;

    contentListStore.activate({ collectionAddress: collectionStore.data });

    return () => contentListStore.deactivate();
  }, [contentListStore, collectionStore.data]);

  return (
    <Group>
      <Loader isLoading={contentListStore.isLoading || collectionStore.isLoading}>
        <EmptyPage
          isEmpty={!contentListStore.data}
          action={
            <Button onClick={() => push(Route.CREATE)}>
              Создать первую NFT!
            </Button>
            }
        >
          {contentListStore.data?.map((content) => (
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
