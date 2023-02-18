import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationModule } from 'src/application/application.module';
import { CollectionModule } from 'src/collection/collection.module';
import { ContractsModule } from 'src/contracts/contracts.module';
import { UserModule } from 'src/user/user.module';
import { MetadataSchema } from '../schemas/metadata.schema';
import { MetadataImagesController } from './metadata-images.controller';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Metadata', schema: MetadataSchema }]),
    CollectionModule,
    ContractsModule,
  ],
  controllers: [MetadataController, MetadataImagesController],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
