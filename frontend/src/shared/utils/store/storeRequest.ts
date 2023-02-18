import { action } from 'mobx';

import { SnackbarStore } from '../../../app/store/Snackbar.store';
import { tap } from '../structs';

export interface Store<Data = any> {
  data?: Data
  isLoading: boolean
  snackbarStore: SnackbarStore
}

export const storeRequest = <Data>(
  target: Store<Data>,
  request: Promise<Data | void>,
  callback: (data: Data) => void,
  successText?: string,
): void => {
  target.isLoading = true;
  request
    .then(
      tap(
        action((data) => {
          if (target.isLoading) {
            target.isLoading = false;
          }
          if (data) {
            callback(data);
          }
        }),
      ),
    )
    .then(
      tap(
        action(() => {
          if (successText && target.snackbarStore) {
            target.snackbarStore.setSuccessSnackbar(successText);
          }
        }),
      ),
    )
    .catch(
      action((error) => {
        target.snackbarStore.setErrorSnackbar(JSON.stringify(error));
        if (target.isLoading) {
          target.isLoading = false;
        }
      }),
    );
};
