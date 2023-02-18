import { Icon20CrownCircleFillVkDating } from '@vkontakte/icons';
import { CellButton, Group, Spinner } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { Loader } from '../features';
import { useCollectionRequest, useStores } from '../shared';
import { ApplicationList, ContentItem } from '../widgets';

export const NftPage: React.FC = observer((() => {
  const { contentStore, applicationStore, walletStore, ownerStore } = useStores();

  useCollectionRequest();

  const onClick = () => {
    if (!contentStore.data) return;

    applicationStore.requestCreate(contentStore.data._id);
  };

  useEffect(() => {
    if (!contentStore.data) return;

    applicationStore.activate(contentStore.data._id);
  }, [contentStore.data]);

  useEffect(() => {
    return () => {
      contentStore.deactivate();
      applicationStore.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!walletStore.data || !contentStore.data) return;

    ownerStore.activate({
      account: walletStore.data,
      collectionAddress: contentStore.data.nftCollection.collectionAddress,
    });

    return () => ownerStore.deactivate();
  }, [walletStore.data, contentStore.data]);

  return (
    <Group>
      <Loader isLoading={contentStore.isLoading || ownerStore.isLoading}>
        <ContentItem content={contentStore.data} />
        {contentStore.data && !ownerStore.data &&
          <CellButton
            disabled={!!applicationStore.data}
            centered
            before={applicationStore.isLoading ? (
              <Spinner style={{ width: 30, padding: '10px 8px 10px 0' }} />
            ) : (
              <Icon20CrownCircleFillVkDating />
            )}
            onClick={onClick}
          >
            {applicationStore.data ? (
              'Заявка на доступ отправлена'
            ) : (
              'Получить полный доступ'
            )}
          </CellButton>
        }
        {ownerStore.data && (
          <ApplicationList />
        )}
      </Loader>
    </Group>
  );
}));
