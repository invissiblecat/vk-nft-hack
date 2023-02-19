import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Request,
} from '@nestjs/common';
import { ContractsService } from 'src/contracts/contracts.service';
import { CheckSignature } from 'src/guards/guards';
import { Collection } from 'src/schemas/collection.schema';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    readonly contractsService: ContractsService,
  ) {}

  @Get(':collectionAddress')
  @CheckSignature()
  async findAll(
    @Request() req,
    @Param('collectionAddress') collectionAddress: string,
  ): Promise<Collection> {
    const isOwner = await this.contractsService.isCollectionOwner(req.user, {
      collectionAddress,
    });
    if (!isOwner) {
      throw new ForbiddenException();
    }
    return this.collectionService.findOne({ collectionAddress });
  }
}
