import { apiUrl } from '../../../app/services';

export const getImgSrc = (tokenId: string, collectionAddress: string, signature?: string) =>
  `${apiUrl}/images/${tokenId}?collectionAddress=${collectionAddress}&signature=${signature}`;
