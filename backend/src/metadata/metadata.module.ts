import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionModule } from 'src/collection/collection.module';
import { MetadataSchema } from '../schemas/metadata.schema';
import { MetadataImagesController } from './metadata-images.controller';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Metadata', schema: MetadataSchema }]),
    CollectionModule,
  ],
  controllers: [MetadataController, MetadataImagesController],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
