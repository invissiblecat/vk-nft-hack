import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { getUserAddress } from 'src/constants';

@Injectable()
export class SignatureStrategy extends PassportStrategy(Strategy, 'signature') {
  constructor() {
    super();
  }
  async validate(req: Request): Promise<string> {
    const headers: any = req.headers;
    const signature: string = headers.authorization;
    return getUserAddress(signature);
  }
}
