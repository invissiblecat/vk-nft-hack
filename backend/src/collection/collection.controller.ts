import { Controller, Get } from '@nestjs/common';
import { CheckSignature } from 'src/guards/guards';
import { Collection } from 'src/schemas/collection.schema';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('all')
  @CheckSignature()
  async findAll(): Promise<Collection[]> {
    return this.collectionService.findAll();
  }
}
