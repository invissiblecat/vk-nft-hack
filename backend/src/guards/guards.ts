import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
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
  return applyDecorators(UseGuards(SignatureGuard));
}
