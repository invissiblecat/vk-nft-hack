export class CreateMetadataDto {
  readonly tokenId: string;
  readonly collectionAddress: string;
  readonly ownerId: number;
  readonly title: string;
  readonly txHash: string;
  readonly tokenDescription?: string;
  readonly link?: string;
  readonly text?: string;
}
