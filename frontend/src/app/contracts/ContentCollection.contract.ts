import ContentCollectionAbi from '../abi/ContentCollection.json';
import { ContentCollection } from '../abi/types';
import { walletService } from '../services';
import { ContentCreate } from '../types';
import { Contract } from './contract';

class ContentCollectionContract extends Contract {
  constructor() {
    super(ContentCollectionAbi);
  }

  // collection({ vkId, address }: { vkId: number; address: string }) {
  //   const contract = this._getContract<ContentCollection>(address);
  //   return contract.ownerToCollection(vkId);
  // }

  createNft({
    address,
    content: { whitelistPlaces, initialWhitelistMembers },
  }: {
    address: string,
    content: ContentCreate
  }) {
    const contract = this._getContract<ContentCollection>(address);
    return contract.connect(walletService.signer!).createNft(1, whitelistPlaces, initialWhitelistMembers);
  }
}

export const contentCollectionContract = new ContentCollectionContract();
