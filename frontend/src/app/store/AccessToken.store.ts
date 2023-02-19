import bridge from '@vkontakte/vk-bridge';
import { makeAutoObservable } from 'mobx';

import { Store, storeRequest, storeReset } from '../../shared';
import { SnackbarStore } from './Snackbar.store';

export class AccessTokenStore implements Store<any | void> {
  isLoading = false;

  snackbarStore: SnackbarStore;

  data: string = '';

  constructor({ snackbarStore }: { snackbarStore: SnackbarStore }) {
    this.snackbarStore = snackbarStore;
    makeAutoObservable(this, {
      snackbarStore: false,
    });
  }

  setData(data: string) {
    this.data = data;
  }

  reload() {
    this.request();
  }

  reset() {
    storeReset(this);
    this.data = '';
  }

  request() {
    storeRequest(
      this,
      // @ts-ignore
      bridge.send('VKWebAppGetAuthToken', {
        app_id: 51557564,
        scope: '',
      }),
      // @ts-ignore
      ({ access_token }) => this.setData(access_token),
    );
  }

  activate() {
    this.request();
  }

  deactivate() {
    this.reset();
  }
}
