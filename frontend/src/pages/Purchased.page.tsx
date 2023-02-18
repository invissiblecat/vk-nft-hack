import { Group, SimpleCell } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { apiService } from '../app/services';
import { Loader } from '../features';
import { useStores } from '../shared';

export const PurchasedPage: React.FC = observer(() => {
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
          {contentStore.data?.map(({ tokenId, nftCollection, pathToPreview }) => (
            <>
              {pathToPreview && (
                <img
                  key={tokenId + nftCollection}
                  src={`/images/${tokenId}?collectionAddress=${nftCollection.collectionAddress}&signature=${apiService.signature}`}
                  alt=""
                  width={30}
                  height={30}
                />
              )}
            </>
          ))}
        </Loader>
      </Group>
    </>
  );
});
