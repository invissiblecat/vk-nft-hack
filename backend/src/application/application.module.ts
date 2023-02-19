import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractsModule } from 'src/contracts/contracts.module';
import { ContractsService } from 'src/contracts/contracts.service';
import { GuardModule } from 'src/guards/guards.module';
import { MetadataModule } from 'src/metadata/metadata.module';
import { MetadataService } from 'src/metadata/metadata.service';
import { ApplicationSchema } from 'src/schemas/application.schema';
import { UserModule } from 'src/user/user.module';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Application', schema: ApplicationSchema },
    ]),
    MetadataModule,
    UserModule,
    ContractsModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
