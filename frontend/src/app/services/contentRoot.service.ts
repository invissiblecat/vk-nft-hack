import { contentRootContract } from '../contracts';

class ContentRootService {
  async createCollection(...req: Parameters<typeof contentRootContract.createCollection>) {
    const tx = await contentRootContract.createCollection(...req);
    await tx.wait();

    // TODO: fix
    // storeRequest ругается
    return '';
  }
}

export const contentRootService = new ContentRootService();
