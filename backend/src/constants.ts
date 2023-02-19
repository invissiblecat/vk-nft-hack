import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { verifyMessage, isAddress } from 'ethers/lib/utils';
import { Metadata } from './schemas/metadata.schema';

export const DEFAULT_METADATA_EXCLUDE = ['-pathToImage', '-__v'];

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

export const messageToSign = 'sign message'; //todo make dynamic message

export const getUserAddress = (signature: string) => {
  try {
    const userAddress = verifyMessage(messageToSign, signature);

    if (!isAddress(userAddress)) {
      throw new UnauthorizedException(`Wrong signature`);
    }
    return userAddress;
  } catch (error) {
    console.log({ error });
    throw new UnauthorizedException(`Wrong signature`);
  }
};
