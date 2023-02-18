import ContentCollectionAbi from '../abi/ContentCollection.json';
import { ContentCollection } from '../abi/types';
import { walletService } from '../services';
import { ContentCreateContract } from '../types';
import { Contract } from './contract';

class ContentCollectionContract extends Contract {
  constructor() {
    super(ContentCollectionAbi);
  }

  createNft({
    address,
    content: { whitelistPlaces, initialWhitelistMembers },
  }: {
    address: string,
    content: ContentCreateContract
  }) {
    const contract = this._getContract<ContentCollection>(address);
    return contract.connect(walletService.signer!).createNft(whitelistPlaces, initialWhitelistMembers);
  }

  owner(address: string) {
    const contract = this._getContract<ContentCollection>(address);
    return contract.owner();
  }

  setWhitelistMembers({
    address,
    tokenId,
    members,
  }: {
    address: string,
    tokenId: string
    members: string[]
  }) {
    const contract = this._getContract<ContentCollection>(address);
    return contract.connect(walletService.signer!).setWhitelistMembers(tokenId, members);
  }

  deleteWhitelistMembers({
    address,
    tokenId,
    members,
  }: {
    address: string,
    tokenId: string
    members: string[]
  }) {
    const contract = this._getContract<ContentCollection>(address);
    return contract.connect(walletService.signer!).deleteWhitelistMembers(tokenId, members);
  }
}

export const contentCollectionContract = new ContentCollectionContract();
