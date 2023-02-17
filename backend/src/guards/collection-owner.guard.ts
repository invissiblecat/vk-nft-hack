import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContractsService } from 'src/contracts/contracts.service';
import { CreateMetadataDto } from 'src/metadata/dto/create-metadata.dto';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly contractsService: ContractsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const args = context.getArgs();
    const body: CreateMetadataDto = args[0].body;
    const userAddress = args[0].user;

    return this.isCollectionOwner(body.collectionAddress, userAddress);
  }

  async isCollectionOwner(collectionAddress: string, userAddress: string) {
    const collectionOwner = await this.contractsService.getCollectionOwner(
      collectionAddress,
    );

    return collectionOwner.toLowerCase() === userAddress.toLowerCase();
  }
}
