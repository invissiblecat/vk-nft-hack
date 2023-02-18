import { Icon28ListLikeOutline } from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { useStores } from '../../../shared';
import { ApplicationListBase } from '../ApplicationListBase';

export interface ApplicationListDeclinedProps {
  declinedAddresses: string[]
}

export const ApplicationListDeclined: React.FC<ApplicationListDeclinedProps> = observer(({ declinedAddresses }) => {
  const { applicationListStore, contentStore, collectionAddressStore, snackbarStore } = useStores();
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);

  const request = () => {
    if (!applicationListStore.data) return snackbarStore.setErrorSnackbar('Заявки не найдены');
    if (!collectionAddressStore.data) return snackbarStore.setErrorSnackbar('Коллекция не найдена');
    if (!contentStore.data) return snackbarStore.setErrorSnackbar('NFT не найден');

    applicationListStore.approveApplicationList({
      address: collectionAddressStore.data,
      tokenId: contentStore.data.tokenId,
      tokenDbId: contentStore.data._id,
      members: selectedAddresses,
      accepted: applicationListStore.data.reduce<string[]>((result, { user, _id }) => {
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
      icon={<Icon28ListLikeOutline style={{ color: 'white' }} />}
      title="Отклоненные заявки"
      addresses={declinedAddresses}
      request={request}
      selectedAddresses={selectedAddresses}
      setSelectedAddresses={setSelectedAddresses}
      buttonText="Одобрить заявки"
    />
  );
});
