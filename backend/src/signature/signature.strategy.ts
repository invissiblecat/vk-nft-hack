import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isAddress, verifyMessage } from 'ethers';
import { Strategy } from 'passport-custom';

export const messageToSign = '123'; //todo make dynamic message

@Injectable()
export class SignatureStrategy extends PassportStrategy(Strategy, 'signature') {
  constructor() {
    super();
  }
  async validate(req: Request): Promise<any> {
    const headers: any = req.headers;
    const auth: string = headers.authorization;
    const signature = auth.split('Signature')[1].trim();

    try {
      const userAddress = verifyMessage(messageToSign, signature);
      if (!isAddress(userAddress)) {
        throw new UnauthorizedException(`Wrong signature`);
      }
      return userAddress;
    } catch (error) {
      throw new UnauthorizedException(`Wrong signature`);
    }
  }
}
