import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetadataModule } from './metadata/metadata.module';
import { SignatureModule } from './signature/signature.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MetadataModule,
    SignatureModule,
  ],
})
export class AppModule {}
