import Web3 from "web3";
import * as EthTx from 'ethereumjs-tx';
import {isNullOrUndefined} from 'util';

export class EthereumTransaction {

  public signature: string;
  public nonce: number;

  constructor(
    readonly gasLimit: Web3.utils.BN,
    readonly gasPrice: Web3.utils.BN,
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
    return {
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      to: this.toAddress,
      value: this.value,
      data: this.data
    };
  }

  public signTxWithPrivKey(privKey: string) {
    const p = privKey.startsWith("0x") ? privKey.substr(2) : privKey;
    const tx = new EthTx(this.getUnsignedTx());
    tx.sign(new Buffer(privKey, 'hex'));
    this.signature = '0x' + tx.serialize().toString('hex');
  }
}
