import { CONTENT_COLLECTION_ADDRESSES_MAP } from '../../shared';
import { contentCollectionContract } from '../contracts';
import { ChainId } from '../enums';
import { nftCreateBackend, nftCreateContract } from '../types';
import { apiService } from './api.service';

type Req = Omit<nftCreateBackend, 'tokenId'> & nftCreateContract & { file?: File }

class ContentCollectionService {
  async createNft({ initialWhitelistMembers, whitelistPlaces, file, ...reqBackend }: Req) {
    const tx = await contentCollectionContract.createNft({
      address: CONTENT_COLLECTION_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      content: { whitelistPlaces, initialWhitelistMembers },
    });
    const { events } = await tx.wait();
    console.log(events);

    await apiService.createNft({ ...reqBackend, tokenId: '0' });
    console.log(file);

    // TODO: fix
    // storeRequest ругается
    return '';
  }
}

export const contentCollectionService = new ContentCollectionService();
