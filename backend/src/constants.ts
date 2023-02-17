import { NotFoundException } from '@nestjs/common';
import { Metadata } from './schemas/metadata.schema';

export const DEFAULT_METADATA_EXCLUDE = [
  '-pathToImage',
  '-pathToPreview',
  '-__v',
];

export const DEAFULT_IMAGES_PATH = 'images';

export const checkMetadataOrThrow = (
  tokenMetadata: Metadata | undefined,
  tokenId: string,
) => {
  if (!tokenMetadata) {
    throw new NotFoundException(
      `Metadata for token with id ${tokenId} not found`,
    );
  }
};
