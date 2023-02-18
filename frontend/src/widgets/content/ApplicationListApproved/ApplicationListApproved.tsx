import { Icon28ListLikeSlashOutline } from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { useStores } from '../../../shared';
import { ApplicationListBase } from '../ApplicationListBase';

export interface ApplicationListApprovedProps {
  approvedAddresses: string[]
}

export const ApplicationListApproved: React.FC<ApplicationListApprovedProps> = observer(({ approvedAddresses }) => {
  const { applicationListStore, contentStore, collectionStore, snackbarStore } = useStores();
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);

  const request = () => {
    if (!applicationListStore.data) return snackbarStore.setErrorSnackbar('Заявки не найдены');
    if (!collectionStore.data) return snackbarStore.setErrorSnackbar('Коллекция не найдена');
    if (!contentStore.data) return snackbarStore.setErrorSnackbar('NFT не найден');

    applicationListStore.declineApplicationList({
      address: collectionStore.data,
      tokenId: contentStore.data.tokenId,
      tokenDbId: contentStore.data._id,
      members: selectedAddresses,
      declined: applicationListStore.data.reduce<string[]>((result, { user, _id }) => {
        if (selectedAddresses.includes(user.address)) {
          result.push(_id);
        }

        return result;
      }, []),
    });
    setSelectedAddresses([]);
  };

  return (
    <ApplicationListBase
      icon={<Icon28ListLikeSlashOutline style={{ color: 'white' }} />}
      title="Одобренные заявки"
      addresses={approvedAddresses}
      request={request}
      selectedAddresses={selectedAddresses}
      setSelectedAddresses={setSelectedAddresses}
      buttonText="Отклонить заявки"
    />
  );
});
