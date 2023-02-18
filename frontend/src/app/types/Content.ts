import { Collection } from './Collection';

export interface ContentCreateContract {
  whitelistPlaces: string,
  initialWhitelistMembers: string[]
}

export interface ContentCreateBackend {
  tokenId: string;
  collectionAddress: string;
  ownerId: number;
  tokenDescription?: string;
  link?: string;
  text?: string;
}

export interface Content {
  tokenId: string,
  nftCollection: Collection,
  tokenDescription?: string,
  title: string;
  link?: string,
  text?: string,
  pathToImage?: string,
  pathToPreview?: string,
  applications?: any[]
}
