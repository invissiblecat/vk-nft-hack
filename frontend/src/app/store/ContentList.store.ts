import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { apiService } from '../services';
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

  activate() {
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
