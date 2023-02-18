import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Response,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { CollectionService } from 'src/collection/collection.service';
import { CheckCollectionOwner, CheckSignature } from 'src/guards/guards';
import { isAddress } from 'ethers/lib/utils';
import { ContractsService } from 'src/contracts/contracts.service';
import { DEFAULT_METADATA_EXCLUDE } from 'src/constants';
import _, { omit } from 'lodash';

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
      return omit(metadata, ['link', 'text', 'pathToImage']);
    });
  }

  @Get('availible')
  @CheckSignature()
  async findAvailible(@Request() req): Promise<Metadata[]> {
    const { metadatas, accesses } =
      await this.metadataService.findMetadataWithAccesses(req.user);
    return metadatas.filter((_, i) => {
      if (accesses[i]) return true;
      return false;
    });
  }

  @Get(':tokenId')
  @CheckSignature()
  async find(
    @Request() req,
    @Param('tokenId') tokenId: string,
    @Query('collectionAddress') collectionAddress: string, //todo REFACTOR!
  ): Promise<Metadata> {
    const collection = await this.collectionService.findOne({
      collectionAddress,
    });
    const hasAccess = this.contractsService.hasAccessToToken(
      req.user,
      collectionAddress,
      tokenId,
    );
    if (hasAccess) {
      return this.metadataService.findOne(
        {
          tokenId,
          nftCollection: collection._id,
        },
        DEFAULT_METADATA_EXCLUDE,
      );
    }
    return this.metadataService.findOne(
      {
        tokenId,
        nftCollection: collection._id,
      },
      ['-link', '-text', ...DEFAULT_METADATA_EXCLUDE],
    );
  }
}
