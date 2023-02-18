import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata, MetadataDocument } from '../schemas/metadata.schema';
import { CollectionService } from 'src/collection/collection.service';
import { CheckCollectionOwner, CheckSignature } from 'src/guards/guards';
import { isAddress } from 'ethers/lib/utils';
import { ContractsService } from 'src/contracts/contracts.service';

import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { ApplicationService } from 'src/application/application.service';

const spreadMetadata = (metadata: MetadataDocument) => {
  const { link, text, pathToImage, ...data } = metadata.toObject();
  return data;
};
@Controller('metadata')
export class MetadataController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly collectionService: CollectionService,
    private readonly contractsService: ContractsService,
  ) {}

  @Post()
  @CheckCollectionOwner()
  async create(@Body() createMetadataDto: CreateMetadataDto) {
    const { collectionAddress, ownerId, ...data } = createMetadataDto;
    try {
      let collection = await this.collectionService.findOne({
        collectionAddress,
      });
      if (!collection) {
        if (!isAddress(collectionAddress)) {
          throw new UnprocessableEntityException(
            `Collection address is not correct`,
          );
        }
        collection = await this.collectionService.create({
          collectionAddress,
          ownerId,
        });
      }
      const existingMetadata =
        await this.collectionService.findMetadataByTokenId(
          collectionAddress,
          data.tokenId,
        );
      if (existingMetadata) {
        throw new ForbiddenException('Metadata already exists');
      }

      const metadata = await this.metadataService.create({
        ...data,
        nftCollection: collection,
      });
      await this.collectionService.addTokenMetadata(collection.id, metadata.id);
    } catch (error) {
      if (error.code == 11000) {
        throw new UnprocessableEntityException(
          'Duplicate key. Check if tokenId is unique',
        );
      }
    }
  }

  @Get()
  @CheckSignature()
  async findAll(@Request() req): Promise<Metadata[]> {
    const { metadatas, accesses } =
      await this.metadataService.findMetadataWithAccesses(req.user);
    return metadatas.map((metadata, i) => {
      if (accesses[i]) return metadata;
      return spreadMetadata(metadata);
    });
  }

  @Get(':tokenId')
  @CheckSignature()
  async find(
    @Request() req,
    @Param('tokenId') tokenId: string,
    @Query('collectionAddress') collectionAddress: string,
  ): Promise<Metadata> {
    const hasAccess = await this.contractsService.hasAccessToToken(
      req.user,
      collectionAddress,
      tokenId,
    );
    const collection = await this.collectionService.findOne({
      collectionAddress,
    });
    const metadata = await this.metadataService.findOne({
      tokenId,
      nftCollection: new Types.ObjectId(collection.id),
    });
    console.log({ hasAccess });

    if (hasAccess) {
      return metadata;
    }

    return spreadMetadata(metadata);
  }
}
