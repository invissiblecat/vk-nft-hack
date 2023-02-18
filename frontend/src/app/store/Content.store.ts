import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { apiService, contentService } from '../services';
import { Content } from '../types';
import { SnackbarStore } from './Snackbar.store';

type CreateReq = Parameters<typeof contentService.createNft>
type GetReq = Parameters<typeof apiService.getNft>

export class ContentStore implements Store<Content | void> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: Content = undefined;

  req: GetReq = [{ tokenId: '', collectionAddress: '' }];

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: Content) {
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
      apiService.getNft(...this.req),
      (data) => this.setData(data),
    );
  }

  requestCreate(...req: CreateReq) {
    storeRequest(
      this,
      contentService.createNft(...req),
      () => {
        this.reload();
        this.snackbarStore.setSuccessSnackbar('Контент создан');
      },
    );
  }

  activate(...req: GetReq) {
    this.req = req;
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
