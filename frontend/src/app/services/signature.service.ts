class SignatureService {
  private _signature = '';

  get signature() {
    return this._signature;
  }

  setSignature(signature: string): void {
    this._signature = signature;
  }

  reset() {
    this._signature = '';
  }
}

export const signatureService = new SignatureService();
