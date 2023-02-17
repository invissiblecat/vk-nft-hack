import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { walletService } from '../services';
import { SnackbarStore } from './Snackbar.store';

export class WalletStore implements Store<string> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: string = undefined;

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data?: string) {
    this.data = data;
  }

  reset() {
    storeReset(this);
    this.data = undefined;
  }

  request() {
    storeRequest(
      this,
      walletService.connect(),
      (data) => this.setData(data),
    );
  }

  activate() {
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
