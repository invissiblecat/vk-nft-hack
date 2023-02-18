import { BigNumber } from 'ethers';

import { contentCollectionContract } from '../contracts';
import { ContentCreateBackend, ContentCreateContract } from '../types';
import { apiService } from './api.service';

type Req = Omit<ContentCreateBackend, 'tokenId' | 'txHash'> & ContentCreateContract & { file?: Blob & { preview?: string }, address: string; }

class ContentService {
  async createNft({ address, initialWhitelistMembers, whitelistPlaces, file, ...reqBackend }: Req) {
    const tx = await contentCollectionContract.createNft({
      address,
      content: { whitelistPlaces, initialWhitelistMembers },
    });
    const { events, transactionHash } = await tx.wait();
    if (!events) throw new Error('Ошибка: events not found');

    const [{ topics }] = events;

    if (!topics.length) throw new Error('Ошибка: topics not found');

    const tokenIdBN = BigNumber.from(topics[topics.length - 1]);
    const tokenId = tokenIdBN.toString();

    await apiService.createNft({ ...reqBackend, tokenId, txHash: transactionHash });
    if (file) {
      await apiService.uploadImage({ file, tokenId, collectionAddress: address });
    }
  }

  async isOwner({ account, collectionAddress }: { account: string, collectionAddress: string }) {
    const owner = await contentCollectionContract.owner(collectionAddress);

    return owner === account;
  }

  async setWhitelistMembers({
    address,
    tokenId,
    tokenDbId,
    members,
    accepted,
  }: {
    address: string,
    tokenId: string,
    tokenDbId: string,
    members: string[]
    accepted: string[]
  }) {
    const tx = await contentCollectionContract.setWhitelistMembers({ address, tokenId, members });
    await tx.wait();

    await apiService.updateApplicationList({ tokenId: tokenDbId, address, accepted });
  }

  async deleteWhitelistMembers({
    address,
    tokenId,
    tokenDbId,
    members,
    declined,
  }: {
    address: string,
    tokenId: string,
    tokenDbId: string,
    members: string[]
    declined: string[]
  }) {
    const tx = await contentCollectionContract.deleteWhitelistMembers({ address, tokenId, members });
    await tx.wait();

    await apiService.updateApplicationList({ tokenId: tokenDbId, address, declined });
  }
}

export const contentCollectionService = new ContentService();
