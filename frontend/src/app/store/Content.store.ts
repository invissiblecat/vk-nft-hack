import { push } from '@cteamdev/router';
import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { Route } from '../enums';
import { apiService, contentCollectionService } from '../services';
import { Content } from '../types';
import { SnackbarStore } from './Snackbar.store';

type CreateReq = Parameters<typeof contentCollectionService.createNft>
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
      contentCollectionService.createNft(...req),
      () => {
        if (this.req[0].tokenId && this.req[0].collectionAddress) {
          this.reload();
        }
        this.snackbarStore.setSuccessSnackbar('Контент создан');
        push(Route.MY);
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
