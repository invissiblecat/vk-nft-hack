import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Metadata, MetadataSchema } from '../schemas/metadata.schema';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Metadata', schema: MetadataSchema }]),
  ],
  controllers: [MetadataController],
  providers: [MetadataService],
})
export class MetadataModule {}
