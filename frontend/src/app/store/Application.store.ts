import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { apiService } from '../services';
import { Application } from '../types';
import { SnackbarStore } from './Snackbar.store';

type CreateReq = Parameters<typeof apiService.createApplication>
type GetReq = Parameters<typeof apiService.getApplication>

export class ApplicationStore implements Store<Application | void> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: Application = undefined;

  req: GetReq = [''];

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: Application) {
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
      apiService.getApplication(...this.req),
      (data) => this.setData(data),
    );
  }

  requestCreate(...req: CreateReq) {
    storeRequest(
      this,
      apiService.createApplication(...req),
      () => {
        this.reload();
        this.snackbarStore.setSuccessSnackbar('Заявка отправлена');
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
