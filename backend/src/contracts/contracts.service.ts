import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { collectionAbi } from 'src/abi/collection.abi';
import { rootAbi } from 'src/abi/root.abi';
import { ContentCollection, ContentRoot } from 'src/abi/types';

@Injectable()
export class ContractsService {
  private contentRootContract: ContentRoot;
  private provider: ethers.providers.JsonRpcProvider;
  private inited = false;

  constructor() {
    this.init();
  }

  async init() {
    if (this.inited) return;
    const contractAddress = process.env.CONTENT_ROOT_ADDRESS;
    const rpcNodeUrl = process.env.JSON_RPC;
    console.log({ contractAddress, rpcNodeUrl, rootAbi, collectionAbi });

    if (!contractAddress || !rpcNodeUrl) return;
    this.provider = new ethers.providers.JsonRpcProvider(rpcNodeUrl);
    this.contentRootContract = new Contract(
      contractAddress,
      rootAbi,
      this.provider,
    ) as ContentRoot;
    this.inited = true;
  }

  async getCollectionContract(collectionAddress: string) {
    await this.init();

    return new Contract(
      collectionAddress,
      collectionAbi,
      this.provider,
    ) as ContentCollection;
  }

  async getCollectionAddress(ownerId: string) {
    await this.init();
    return this.contentRootContract.ownerIdToCollection(+ownerId);
  }

  async getCollectionOwner(collectionAddress: string) {
    const collection = await this.getCollectionContract(collectionAddress);
    return collection.owner();
  }
}
