import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { CollectionService } from 'src/collection/collection.service';
import { CheckCollectionOwner } from 'src/guards/guards';
import { isAddress } from 'ethers/lib/utils';

@Controller('metadata')
export class MetadataController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly collectionService: CollectionService,
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
  async findAll(): Promise<Metadata[]> {
    return this.metadataService.findAll();
  }
}
