import { push } from '@cteamdev/router';
import { Button, Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Route } from '../app/enums';
import { Loader } from '../features';
import { useStores } from '../shared';
import { ContentItem } from '../widgets';
import { EmptyPage } from './Empty.page';

export const FeedPage: React.FC = observer(() => {
  const { contentListStore, contentStore } = useStores();

  useEffect(() => {
    contentListStore.activate();

    return () => contentListStore.deactivate();
  }, [contentListStore]);

  return (
    <>
      <Group>
        <Loader isLoading={contentListStore.isLoading}>
          <EmptyPage
            isEmpty={!contentListStore.data}
            action={
              <Button onClick={() => push(Route.CREATE)}>
                Буду первый!
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
    </>
  );
});
