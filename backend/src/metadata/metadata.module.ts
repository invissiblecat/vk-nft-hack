import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetadataSchema } from '../schemas/metadata.schema';
import { MetadataImagesController } from './metadata-images.controller';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Metadata', schema: MetadataSchema }]),
  ],
  controllers: [MetadataController, MetadataImagesController],
  providers: [MetadataService],
})
export class MetadataModule {}
