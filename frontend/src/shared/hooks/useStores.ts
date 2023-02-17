import { useContext } from 'react';

import { StoreContext } from '../../app/context';
import { RootStore } from '../../app/store';

export function useStores(): RootStore {
  return useContext(StoreContext);
}
