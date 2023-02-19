import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContractsService } from 'src/contracts/contracts.service';
import { CreateMetadataDto } from 'src/metadata/dto/create-metadata.dto';
import { MetadataService } from 'src/metadata/metadata.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly contractsService: ContractsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const args = context.getArgByIndex(0);
    const body: CreateMetadataDto = args.body;
    const userAddress = args.user;

    return this.contractsService.isCollectionOwner(userAddress, {
      collectionAddress: body.collectionAddress,
    });
  }
}
