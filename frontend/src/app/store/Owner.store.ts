import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { contentCollectionService } from '../services';
import { SnackbarStore } from './Snackbar.store';

type Req = Parameters<typeof contentCollectionService.isOwner>

export class OwnerStore implements Store<boolean | void> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data: boolean = false;

  req: Req = [{ account: '', collectionAddress: '' }];

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: boolean) {
    this.data = data;
  }

  reload() {
    this.request();
  }

  reset() {
    storeReset(this);
    this.data = false;
  }

  request() {
    storeRequest(
      this,
      contentCollectionService.isOwner(...this.req),
      (data) => this.setData(data),
    );
  }

  activate(...req: Req) {
    this.req = req;
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
