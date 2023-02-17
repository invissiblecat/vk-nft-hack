import { createContext } from 'react';

import { RootStore, rootStore } from '../store';

export const StoreContext = createContext<RootStore>(rootStore);
