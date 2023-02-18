import { useEffect } from 'react';

import { ChainId } from '../../app/enums';
import { CONTENT_ROOT_ADDRESSES_MAP } from '../utils';
import { useStores } from './useStores';

export const useCollectionRequest = () => {
  const { collectionStore, userStore } = useStores();

  useEffect(() => {
    // if (!userStore.data) return;

    collectionStore.activate({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      // vkId: 1,
      vkId: 67135042,
      // vkId: userStore.data.id,
    });
  }, [collectionStore, userStore.data]);
};
