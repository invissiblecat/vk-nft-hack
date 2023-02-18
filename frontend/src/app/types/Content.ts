import { Collection } from './Collection';

export interface ContentCreateContract {
  whitelistPlaces: string,
  initialWhitelistMembers: string[]
}

export interface ContentCreateBackend {
  tokenId: string;
  collectionAddress: string;
  ownerId: number;
  txHash: string;
  tokenDescription?: string;
  link?: string;
  text?: string;
}

export interface Content {
  _id: string
  tokenId: string,
  nftCollection: Collection,
  tokenDescription?: string,
  txHash: string;
  title: string;
  link?: string,
  text?: string,
  pathToImage?: string,
  pathToPreview?: string,
  applications?: any[]
}
