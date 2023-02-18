import { push } from '@cteamdev/router';
import { Button, Group, SimpleCell, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Route } from '../app/enums';
import { Loader } from '../features';
import { useCollectionRequest, useStores } from '../shared';
import { ContentItem } from '../widgets';
import { EmptyPage } from './Empty.page';

export const MyCollectionPage: React.FC = observer(() => {
  const { contentListStore, contentStore, collectionAddressStore, collectionStore } = useStores();

  useCollectionRequest();

  useEffect(() => {
    if (!collectionAddressStore.data) return;

    contentListStore.activate({ collectionAddress: collectionAddressStore.data });
    collectionStore.activate(collectionAddressStore.data);

    return () => {
      contentListStore.deactivate();
      collectionStore.deactivate();
    };
  }, [collectionAddressStore.data]);

  return (
    <Group>
      <Loader isLoading={contentListStore.isLoading || collectionAddressStore.isLoading}>
        <EmptyPage
          isEmpty={!contentListStore.data || !contentListStore.data.length}
          action={
            <Button onClick={() => push(Route.CREATE)}>
              Создать первую NFT!
            </Button>
            }
        >
          <SimpleCell disabled>
            <Title level="2">{collectionStore.data?.name} ({collectionStore.data?.symbol})</Title>
          </SimpleCell>
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
