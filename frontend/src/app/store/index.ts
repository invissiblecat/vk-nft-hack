import { CollectionStore } from './Collection.store';
import { ContentStore } from './Content.store';
import { ContentListStore } from './ContentList.store';
import { SnackbarStore } from './Snackbar.store';
import { UserStore } from './User.store';
import { WalletStore } from './Wallet.store';

export class RootStore {
  snackbarStore: SnackbarStore;

  userStore: UserStore;

  walletStore: WalletStore;

  collectionStore: CollectionStore;

  contentListStore: ContentListStore;

  contentStore: ContentStore;

  constructor() {
    this.snackbarStore = new SnackbarStore();
    this.userStore = new UserStore(this);
    this.walletStore = new WalletStore(this);
    this.collectionStore = new CollectionStore(this);
    this.contentListStore = new ContentListStore(this);
    this.contentStore = new ContentStore(this);
  }
}

export const rootStore = new RootStore();
