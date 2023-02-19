import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractsModule } from 'src/contracts/contracts.module';
import { CollectionSchema } from 'src/schemas/collection.schema';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
    ContractsModule,
  ],
  controllers: [CollectionController],
  exports: [CollectionService],
  providers: [CollectionService],
})
export class CollectionModule {}
