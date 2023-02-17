import { applyDecorators, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OwnerGuard } from 'src/guards/collection-owner.guard';

@Injectable()
export class SignatureGuard extends AuthGuard('signature') {}
