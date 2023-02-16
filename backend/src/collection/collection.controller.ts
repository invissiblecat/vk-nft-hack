import { Controller, Get } from '@nestjs/common';
import { Collection } from 'src/schemas/collection.schema';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('all')
  async findAll(): Promise<Collection[]> {
    return this.collectionService.findAll();
  }
}
