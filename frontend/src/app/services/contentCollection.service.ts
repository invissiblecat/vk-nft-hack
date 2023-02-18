import { BigNumber } from 'ethers';

import { contentCollectionContract } from '../contracts';
import { ContentCreateBackend, ContentCreateContract } from '../types';
import { apiService } from './api.service';

type Req = Omit<ContentCreateBackend, 'tokenId'> & ContentCreateContract & { file?: Blob & { preview?: string }, address: string; }

class ContentService {
  async createNft({ address, initialWhitelistMembers, whitelistPlaces, file, ...reqBackend }: Req) {
    const tx = await contentCollectionContract.createNft({
      address,
      content: { whitelistPlaces, initialWhitelistMembers },
    });
    const { events } = await tx.wait();
    if (!events) throw new Error('Ошибка: events not found');

    const [{ topics }] = events;

    if (!topics.length) throw new Error('Ошибка: topics not found');

    const tokenIdBN = BigNumber.from(topics[topics.length - 1]);
    const tokenId = tokenIdBN.toString();

    await apiService.createNft({ ...reqBackend, tokenId });
    if (file) {
      await apiService.uploadImage({ file, tokenId, collectionAddress: address });
    }
  }
}

export const contentService = new ContentService();
