import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OwnerGuard } from './collection-owner.guard';
import { SignatureGuard } from './signature/signature.guard';

export function CheckCollectionOwner() {
  return applyDecorators(
    ApiBearerAuth('Signature'),
    UseGuards(SignatureGuard),
    UseGuards(OwnerGuard),
  );
}

export function CheckSignature() {
  return applyDecorators(ApiBearerAuth('Signature'), UseGuards(SignatureGuard));
}
