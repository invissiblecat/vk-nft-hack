import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { ContentCollection, ContentRoot } from 'src/abi/types';
import CollectionAbi from './ContentCollection.json';
import ContentRootAbi from './ContentRoot.json';
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
    console.log({ contractAddress, rpcNodeUrl, ContentRootAbi, CollectionAbi });

    if (!contractAddress || !rpcNodeUrl) return;
    this.provider = new ethers.providers.JsonRpcProvider(rpcNodeUrl);
    this.contentRootContract = new Contract(
      contractAddress,
      ContentRootAbi,
      this.provider,
    ) as ContentRoot;
    this.inited = true;
  }

  async getCollectionContract(collectionAddress: string) {
    await this.init();

    return new Contract(
      collectionAddress,
      CollectionAbi,
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
