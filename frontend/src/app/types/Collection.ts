import { Content } from './Content';

export interface CollectionCreate {
  vkId: number;
  collectionName: string;
  collectionSymbol: string;
}

export interface Collection {
  collectionAddress: string
  ownerId: number;
  tokensMetadata?: Content[]
}

export interface CollectionData {
  name: string;
  symbol: string;
}
