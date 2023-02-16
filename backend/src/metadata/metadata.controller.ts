import { Body, Controller, Get, Post } from '@nestjs/common';
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
  // @CheckSignature() todo
  async create(@Body() createMetadataDto: CreateMetadataDto) {
    let collection = await this.collectionService.findOne({
      collectionAddress: createMetadataDto.collectionAddress,
    });
    //todo check is correct address
    if (!collection) {
      collection = await this.collectionService.create({
        collectionAddress: createMetadataDto.collectionAddress,
      });
    }

    const { collectionAddress, ...data } = createMetadataDto;
    const metadata = await this.metadataService.create({
      ...data,
      nftCollection: collection,
    });
    await this.collectionService.addTokenMetadata(collection.id, metadata.id);
  }

  @Get()
  async findAll(): Promise<Metadata[]> {
    return this.metadataService.findAll();
  }
}
