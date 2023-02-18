import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!contractAddress || !rpcNodeUrl) {
      throw new NotFoundException(`.env is not correct`); //todo separate checker
    }
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

  async getCollectionAddress(ownerId: number) {
    await this.init();
    return this.contentRootContract.ownerIdToCollection(ownerId);
  }

  async getCollectionOwner({
    collectionAddress,
    ownerId,
  }: {
    collectionAddress?: string;
    ownerId?: number;
  }) {
    if (!collectionAddress) {
      collectionAddress = await this.getCollectionAddress(ownerId);
    }
    const collection = await this.getCollectionContract(collectionAddress);
    return collection.owner();
  }

  async isCollectionOwner(
    userAddress: string,
    {
      collectionAddress,
      ownerId,
    }: {
      collectionAddress?: string;
      ownerId?: number;
    },
  ) {
    const collectionOwner = await this.getCollectionOwner({
      collectionAddress,
      ownerId,
    });
    return collectionOwner.toLowerCase() === userAddress.toLowerCase();
  }

  async hasAccessToToken(
    userAddress: string,
    collectionAddress: string,
    tokenId: string,
  ) {
    const collection = await this.getCollectionContract(collectionAddress);
    return await collection.getAccess(tokenId, userAddress);
  }
}
