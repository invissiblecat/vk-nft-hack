import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { ethers } from 'ethers';
import { isAddress, verifyMessage } from 'ethers/lib/utils';

export const messageToSign = 'sign message'; //todo make dynamic message

@Injectable()
export class SignatureStrategy extends PassportStrategy(Strategy, 'signature') {
  constructor() {
    super();
  }
  async validate(req: Request): Promise<string> {
    const headers: any = req.headers;
    const signature: string = headers.authorization;

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
