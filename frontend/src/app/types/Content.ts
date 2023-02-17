export interface nftCreateContract {
  whitelistPlaces: string,
  initialWhitelistMembers: string[]
}

export interface nftCreateBackend {
  tokenId: string;
  collectionAddress: string;
  ownerId: number;
  tokenDescription?: string;
  link?: string;
  text?: string;
}
