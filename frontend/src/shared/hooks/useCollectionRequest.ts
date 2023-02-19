import { useEffect } from 'react';

import { ChainId } from '../../app/enums';
import { CONTENT_ROOT_ADDRESSES_MAP } from '../utils';
import { useStores } from './useStores';

export const useCollectionRequest = () => {
  const { collectionAddressStore, userStore } = useStores();

  useEffect(() => {
    if (!userStore.data) return;

    collectionAddressStore.activate({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      vkId: userStore.data.id,
    });
  }, [collectionAddressStore, userStore.data]);
};
