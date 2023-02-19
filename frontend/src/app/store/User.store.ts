import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { SnackbarStore } from './Snackbar.store';

export class UserStore implements Store<UserInfo> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data?: UserInfo = undefined;

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: UserInfo) {
    this.data = data;
  }

  reset() {
    storeReset(this);
    this.data = undefined;
  }

  request() {
    storeRequest(
      this,
      bridge.send('VKWebAppGetUserInfo'),
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
