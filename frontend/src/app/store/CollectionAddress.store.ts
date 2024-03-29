import { constants } from 'ethers';
import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { contentRootContract } from '../contracts';
import { contentRootService } from '../services';
import { SnackbarStore } from './Snackbar.store';

type GetReq = Parameters<typeof contentRootContract.collection>
type CreateReq = Parameters<typeof contentRootService.createCollection>

export class CollectionAddressStore implements Store<string> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: string = undefined;

  req: GetReq = [{ address: '', vkId: 0 }];

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: string) {
    if (data === constants.AddressZero) return;

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
      contentRootContract.collection(...this.req),
      (data) => this.setData(data),
    );
  }

  requestCreate(...req: CreateReq) {
    storeRequest(
      this,
      contentRootService.createCollection(...req),
      () => {
        this.reload();
        this.snackbarStore.setSuccessSnackbar('Коллекция создана');
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
