import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SignatureGuard } from './signature.guard';
import { SignatureStrategy } from './signature.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'signature' })],
  providers: [SignatureGuard, SignatureStrategy],
})
export class SignatureModule {}
