import { Module } from '@nestjs/common';
import { ContractsModule } from 'src/contracts/contracts.module';
import { OwnerGuard } from './collection-owner.guard';

@Module({
  imports: [ContractsModule],
  providers: [OwnerGuard],
})
export class GuardModule {}
