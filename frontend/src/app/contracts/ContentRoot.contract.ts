import ContentRootAbi from '../../../../abi/ContentRoot.json';
import { ContentRoot } from '../abi/types';
import { walletService } from '../services';
import { CollectionCreate } from '../types';
import { Contract } from './contract';

class ContentRootContract extends Contract {
  constructor() {
    super(ContentRootAbi);
  }

  collection({ vkId, address }: { vkId: number; address: string }) {
    const contract = this._getContract<ContentRoot>(address);
    return contract.ownerIdToCollection(vkId);
  }

  createCollection({
    address,
    collection: { vkId, collectionName, collectionSymbol },
  }: {
    address: string,
    collection: CollectionCreate
  }) {
    const contract = this._getContract<ContentRoot>(address);
    return contract.connect(walletService.signer!).createCollection(vkId, collectionName, collectionSymbol);
  }
}

export const contentRootContract = new ContentRootContract();
