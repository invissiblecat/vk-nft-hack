import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from 'src/schemas/collection.schema';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionController],
  exports: [CollectionService],
  providers: [CollectionService],
})
export class CollectionModule {}
