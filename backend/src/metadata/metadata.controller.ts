import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { CheckSignature } from 'src/signature/signature.guard';
import { CollectionService } from 'src/collection/collection.service';

@Controller('metadata')
export class MetadataController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly collectionService: CollectionService,
  ) {}

  @Post()
  @CheckSignature()
  async create(@Response() res, @Body() createMetadataDto: CreateMetadataDto) {
    console.log({ u: res.req.user });

    const { collectionAddress, ownerId, ...data } = createMetadataDto;
    try {
      let collection = await this.collectionService.findOne({
        collectionAddress,
      });
      //todo check is correct address
      if (!collection) {
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
