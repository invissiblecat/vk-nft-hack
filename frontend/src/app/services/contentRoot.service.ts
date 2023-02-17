import { CONTENT_ROOT_ADDRESSES_MAP } from '../../shared';
import { contentRootContract } from '../contracts';
import { ChainId } from '../enums';
import { CollectionCreate } from '../types';

class ContentRootService {
  async createCollection(collection: CollectionCreate) {
    const tx = await contentRootContract.createCollection({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      collection,
    });
    await tx.wait();
  }
}

export const contentRootService = new ContentRootService();
