import { Group, SimpleCell } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Loader } from '../features';
import { useStores } from '../shared';
import { ContentItem } from '../widgets';

export const FeedPage: React.FC = observer(() => {
  const { contentStore } = useStores();

  useEffect(() => {
    contentStore.activate();

    return () => contentStore.deactivate();
  }, [contentStore]);

  return (
    <>
      <Group>
        <SimpleCell style={{ pointerEvents: 'none' }}>
          test
        </SimpleCell>
        <Loader isLoading={contentStore.isLoading}>
          {contentStore.data?.map((content) => (
            <ContentItem
              key={content.tokenId + content.nftCollection.collectionAddress}
              content={content}
            />
          ))}
        </Loader>
      </Group>
    </>
  );
});
