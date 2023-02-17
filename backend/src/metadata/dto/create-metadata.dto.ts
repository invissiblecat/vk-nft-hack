export class CreateMetadataDto {
  readonly tokenId: string;
  readonly collectionAddress: string;
  readonly ownerId: number;
  readonly tokenDescription?: string;
  readonly link?: string;
  readonly text?: string;
}
