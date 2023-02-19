import { makeAutoObservable } from 'mobx';

import { SnackbarType } from '../enums';
import { Snackbar } from '../types';

export class SnackbarStore {
  shackbar?: Snackbar = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setSnackbar(snackbar?: Snackbar) {
    this.shackbar = snackbar;
  }

  setErrorSnackbar(text: string) {
    this.setSnackbar({ type: SnackbarType.ERROR, text });
  }

  setSuccessSnackbar(text: string) {
    this.setSnackbar({ type: SnackbarType.SUCCESS, text });
  }
}
