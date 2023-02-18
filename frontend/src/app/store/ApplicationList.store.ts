import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { apiService, contentCollectionService } from '../services';
import { Application } from '../types';
import { SnackbarStore } from './Snackbar.store';

type ApproveReq = Parameters<typeof contentCollectionService.setWhitelistMembers>
type DeclineReq = Parameters<typeof contentCollectionService.deleteWhitelistMembers>

export class ApplicationListStore implements Store<Application[] | void> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: Application[] = undefined;

  req: string = '';

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: Application[]) {
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
      apiService.getApplicationList(this.req),
      (data) => this.setData(data),
    );
  }

  approveApplicationList(...req: ApproveReq) {
    storeRequest(
      this,
      contentCollectionService.setWhitelistMembers(...req),
      () => {
        this.snackbarStore.setSuccessSnackbar('Заявки одобрены');
        this.reload();
      },
    );
  }

  declineApplicationList(...req: DeclineReq) {
    storeRequest(
      this,
      contentCollectionService.deleteWhitelistMembers(...req),
      () => {
        this.snackbarStore.setSuccessSnackbar('Заявки отклонены');
        this.reload();
      },
    );
  }

  activate(tokenId: string) {
    this.req = tokenId;
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
