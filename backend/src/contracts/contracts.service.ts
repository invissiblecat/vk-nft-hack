import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { ContentCollection, ContentRoot } from 'src/abi/types';
import ContentRootAbi from '../../abi/ContentRoot.json';
import CollectionAbi from '../../abi/ContentCollection.json';
@Injectable()
export class ContractsService {
  private contentRootContract: ContentRoot;
  private readonly provider: ethers.providers.JsonRpcProvider;

  constructor() {
    const contractAddress = process.env.CONTENT_ROOT_ADDRESS;
    const rpcNodeUrl = process.env.JSON_RPC;
    if (!contractAddress || !rpcNodeUrl) return;
    this.provider = new ethers.providers.JsonRpcProvider(rpcNodeUrl);
    this.contentRootContract = new Contract(
      contractAddress,
      ContentRootAbi,
      this.provider,
    ) as ContentRoot;
  }

  getCollectionContract(collectionAddress: string) {
    return new Contract(
      collectionAddress,
      CollectionAbi,
      this.provider,
    ) as ContentCollection;
  }

  getCollectionAddress(ownerId: string) {
    return this.contentRootContract.ownerToCollection(+ownerId);
  }

  getCollectionOwner(collectionAddress: string) {
    const collection = this.getCollectionContract(collectionAddress);
    return collection.owner();
  }
}
