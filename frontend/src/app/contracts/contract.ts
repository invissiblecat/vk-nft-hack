import { Contract as ContractEthers } from 'ethers';

import { walletService } from '../services';

export class Contract {
  private _contracts: Map<string, ContractEthers> = new Map();

  constructor(public abi: any) {}

  protected _getContract<T = ContractEthers>(address: string) {
    const contract = this._contracts.get(address);
    if (!contract) {
      return this._registerContract<T>(address);
    }

    return contract as unknown as T;
  }

  private _registerContract<T = ContractEthers>(address: string) {
    const contract = new ContractEthers(address, this.abi, walletService.provider);
    this._contracts.set(address, contract);

    return contract as unknown as T;
  }
}
