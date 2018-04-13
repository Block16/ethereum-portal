import {isNullOrUndefined} from 'util';
import * as EthTx from 'ethereumjs-tx';
import * as ethutils from 'ethereumjs-util';
import {EthereumAsset} from "./ethereum-asset";
import {BigNumber} from 'bignumber.js';

export class EthereumTransaction {

  public signature: string;
  public tokenToAddress;    // Used when we want to store the toAddress in a token TX
  public asset: EthereumAsset;

  constructor(
    readonly gasLimit: string,
    readonly gasPrice: string,
    readonly toAddress: string,
    readonly value: string,
    readonly nonce: string,
    readonly data?: string
  ) {
    this.toAddress = ethutils.addHexPrefix(toAddress);
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

  public valueToBN(): BigNumber {
    return new BigNumber(this.value.substring(2), 16).div(this.asset.places());
  }

  public transactionFees(): BigNumber {
    return new BigNumber(this.gasPrice.substring(2), 16)
      .times(new BigNumber(this.gasLimit.substring(2), 16))
      .div(new BigNumber(10).pow(18));
  }

  public transactionFeesGwei(): BigNumber {
    return this.transactionFees().times('1000000000');
  }
}
