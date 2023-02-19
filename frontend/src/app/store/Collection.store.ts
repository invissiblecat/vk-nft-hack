import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { contentCollectionService } from '../services';
import { CollectionData } from '../types';
import { SnackbarStore } from './Snackbar.store';

export class CollectionStore implements Store<CollectionData> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: CollectionData = undefined;

  req: string = '';

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: CollectionData) {
    this.data = data;
  }

  reload() {
    this.request();
  }

  reset() {
    storeReset(this);
    this.data = undefined;
  }

  request() {
    storeRequest(
      this,
      contentCollectionService.getData(this.req),
      (data) => this.setData(data),
    );
  }

  activate(address: string) {
    this.req = address;
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
