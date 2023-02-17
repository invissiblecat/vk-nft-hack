import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationModule } from './application/application.module';
import { CollectionModule } from './collection/collection.module';
import { ContractsModule } from './contracts/contracts.module';
import { GuardModule } from './guards/guards.module';
import { MetadataModule } from './metadata/metadata.module';
import { SignatureModule } from './guards/signature/signature.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MetadataModule,
    SignatureModule,
    CollectionModule,
    ApplicationModule,
    ContractsModule,
    GuardModule,
  ],
})
export class AppModule {}
