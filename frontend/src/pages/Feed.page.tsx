import { push } from '@cteamdev/router';
import { Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Loader } from '../features';
import { useStores } from '../shared';
import { ContentItem } from '../widgets';

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
          {contentListStore.data?.map((content) => (
            <ContentItem
              key={content.tokenId + content.nftCollection.collectionAddress}
              content={content}
              onClick={() => {
                push('/nft');
                contentStore.activate({
                  tokenId: content.tokenId,
                  collectionAddress: content.nftCollection.collectionAddress,
                });
              }}
            />
          ))}
        </Loader>
      </Group>
    </>
  );
});
