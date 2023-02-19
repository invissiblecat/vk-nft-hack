import { CONTENT_ROOT_ADDRESSES_MAP } from '../../shared';
import { contentRootContract } from '../contracts';
import { ChainId } from '../enums';
import { CollectionCreate } from '../types';
import { apiService } from './api.service';

class ContentRootService {
  async createCollection(collection: CollectionCreate) {
    const tx = await contentRootContract.createCollection({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      collection,
    });
    await tx.wait();
  }

  async getMyNft(address: string) {
    const { tokensMetadata, collectionAddress, ownerId } = await apiService.getCollection(address);

    return (tokensMetadata ?? []).map((content) => ({ ...content, nftCollection: { collectionAddress, ownerId } }));
  }
}

export const contentRootService = new ContentRootService();
