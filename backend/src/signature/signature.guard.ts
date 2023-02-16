import { applyDecorators, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class SignatureGuard extends AuthGuard('signature') {}

export function CheckSignature() {
  return applyDecorators(ApiBearerAuth('Signature'), UseGuards(SignatureGuard));
}
