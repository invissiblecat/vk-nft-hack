export const getImgSrc = (tokenId: string, collectionAddress: string, signature?: string) =>
  `/images/${tokenId}?collectionAddress=${collectionAddress}&signature=${signature}`;
