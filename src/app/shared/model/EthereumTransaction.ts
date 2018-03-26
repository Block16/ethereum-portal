import {isNullOrUndefined} from 'util';
import * as EthTx from 'ethereumjs-tx';

export class EthereumTransaction {

  public signature: string;
  public nonce: number;

  constructor(
    readonly gasLimit: string,
    readonly gasPrice: string,
    readonly toAddress: string,
    readonly value: string,
    readonly data?: string
  ) {
    // Get rid of the 0x prefix
    if (toAddress.startsWith("0x")) {
      this.toAddress = toAddress.substr(2);
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
