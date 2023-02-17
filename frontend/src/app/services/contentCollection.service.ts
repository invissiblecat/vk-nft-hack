import { contentCollectionContract } from '../contracts';

class ContentCollectionService {
  async createNft(...req: Parameters<typeof contentCollectionContract.createNft>) {
    const tx = await contentCollectionContract.createNft(...req);
    await tx.wait();

    // TODO: fix
    // storeRequest ругается
    return '';
  }
}

export const contentCollectionService = new ContentCollectionService();
