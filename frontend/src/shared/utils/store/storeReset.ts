import { Store } from './storeRequest';

export const storeReset = <Target extends Store>(target: Target) => {
  target.isLoading = false;
  target.data = undefined;
};
