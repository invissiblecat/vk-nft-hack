import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), MetadataModule],
})
export class AppModule {}
