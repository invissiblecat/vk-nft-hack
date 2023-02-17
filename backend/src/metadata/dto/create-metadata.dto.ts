export class CreateMetadataDto {
  readonly tokenId: string;
  readonly collectionAddress: string;
  readonly ownerId: string;
  readonly tokenDescription?: string;
  readonly link?: string;
  readonly text?: string;
}
