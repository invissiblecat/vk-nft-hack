import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { apiService, contentRootService } from '../services';
import { Content } from '../types';
import { SnackbarStore } from './Snackbar.store';

export class ContentListStore implements Store<Content[] | void | undefined> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: Content[] = undefined;

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: Content[]) {
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
      apiService.getNftList(),
      (data) => this.setData(data),
    );
  }

  requestMy(collectionAddress: string) {
    storeRequest(
      this,
      contentRootService.getMyNft(collectionAddress),
      (data) => this.setData(data),
    );
  }

  requestAvailable() {
    storeRequest(
      this,
      apiService.getNftListAvailable(),
      (data) => this.setData(data),
    );
  }

  activate(req?: { collectionAddress?: string, available?: boolean }) {
    if (req?.collectionAddress) {
      return this.requestMy(req.collectionAddress);
    }
    if (req?.available) {
      return this.requestAvailable();
    }

    this.request();
  }

  deactivate() {
    this.reset();
  }
}
