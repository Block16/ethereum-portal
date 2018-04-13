import {isNullOrUndefined} from 'util';
import * as EthTx from 'ethereumjs-tx';

export class EthereumTransaction {

  public signature: string;

  constructor(
    readonly gasLimit: string,
    readonly gasPrice: string,
    readonly toAddress: string,
    readonly value: string,
    readonly nonce: string,
    readonly data?: string
  ) {
    if (!toAddress.startsWith('0x')) {
      this.toAddress = '0x' + toAddress;
    } else {
      this.toAddress = toAddress;
    }
  }

  public getUnsignedTx() {
    if (isNullOrUndefined(this.nonce)) {
      throw new Error("Nonce is not set");
    }
    return new EthTx({
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      to: this.toAddress,
      value: this.value,
      data: this.data
    });
  }
}
