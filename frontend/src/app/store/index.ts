import { ApplicationStore } from './Application.store';
import { ApplicationListStore } from './ApplicationList.store';
import { CollectionStore } from './Collection.store';
import { CollectionAddressStore } from './CollectionAddress.store';
import { ContentStore } from './Content.store';
import { ContentListStore } from './ContentList.store';
import { OwnerStore } from './Owner.store';
import { SnackbarStore } from './Snackbar.store';
import { UserStore } from './User.store';
import { WalletStore } from './Wallet.store';

export class RootStore {
  snackbarStore: SnackbarStore;

  userStore: UserStore;

  walletStore: WalletStore;

  collectionAddressStore: CollectionAddressStore;

  collectionStore: CollectionStore;

  contentListStore: ContentListStore;

  contentStore: ContentStore;

  applicationStore: ApplicationStore;

  applicationListStore: ApplicationListStore;

  ownerStore: OwnerStore;

  constructor() {
    this.snackbarStore = new SnackbarStore();
    this.userStore = new UserStore(this);
    this.walletStore = new WalletStore(this);
    this.collectionAddressStore = new CollectionAddressStore(this);
    this.contentListStore = new ContentListStore(this);
    this.contentStore = new ContentStore(this);
    this.applicationStore = new ApplicationStore(this);
    this.applicationListStore = new ApplicationListStore(this);
    this.ownerStore = new OwnerStore(this);
    this.collectionStore = new CollectionStore(this);
  }
}

export const rootStore = new RootStore();
