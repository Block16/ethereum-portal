import {isNullOrUndefined} from 'util';
import * as EthTx from 'ethereumjs-tx';
import * as ethutils from 'ethereumjs-util';
import {EthereumAsset} from "./ethereum-asset";
import {BigNumber} from 'bignumber.js';

export class EthereumTransaction {

  public signature: string;
  public tokenToAddress;        // Used to display to address when there is a token being sent
  public tokenValue: BigNumber; // Used to display when there is a token value being sent
  public asset: EthereumAsset;
  public hash: string;

  constructor(
    readonly gasLimit: string,
    readonly gasPrice: string,
    readonly fromAddress: string,
    readonly toAddress: string,
    readonly value: string,
    readonly nonce: string,
    readonly data?: string
  ) {
    this.fromAddress = ethutils.addHexPrefix(fromAddress);
    this.toAddress = ethutils.addHexPrefix(toAddress);
  }

  public getUnsignedTx(): EthTx {
    if (isNullOrUndefined(this.nonce)) {
      throw new Error("Nonce is not set");
    }
    return new EthTx({
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      from: this.fromAddress,
      to: this.toAddress,
      value: this.value,
      data: this.data
    });
  }

  public txToString(): string {
    return JSON.stringify({
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      from: this.fromAddress,
      to: this.toAddress,
      value: this.value,
      data: this.data
    });
  }

  public getUnsignedObject(): any {
    if (isNullOrUndefined(this.nonce)) {
      throw new Error("Nonce is not set");
    }
    return {
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      from: this.fromAddress,
      to: this.toAddress,
      value: this.value,
      data: this.data
    };
  }

  public valueToBN(): BigNumber {
    if (this.asset.symbol === 'ETH') {
      return new BigNumber(this.value.substring(2), 16).div(this.asset.places());
    } else {
      return this.tokenValue.div(this.asset.places());
    }
  }

  public transactionFees(): BigNumber {
    return new BigNumber(this.gasPrice.substring(2), 16)
      .times(new BigNumber(this.gasLimit.substring(2), 16))
      .div(new BigNumber(10).pow(18));
  }

  // TODO: is this right, this might need to be divided?
  public transactionFeesGwei(): BigNumber {
    return this.transactionFees().times('1000000000');
  }
}
