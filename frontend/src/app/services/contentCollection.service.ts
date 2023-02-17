import { BigNumber } from 'ethers';

import { contentCollectionContract } from '../contracts';
import { nftCreateBackend, nftCreateContract } from '../types';
import { apiService } from './api.service';

type Req = Omit<nftCreateBackend, 'tokenId'> & nftCreateContract & { file?: File, address: string; }

class ContentCollectionService {
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

    await apiService.createNft({ ...reqBackend, tokenId: tokenIdBN.toString() });
    console.log(file);

    // TODO: fix
    // storeRequest ругается
    return '';
  }
}

export const contentCollectionService = new ContentCollectionService();
