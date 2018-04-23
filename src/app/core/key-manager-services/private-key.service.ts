import {HostListener, Injectable} from '@angular/core';
import {KeyManagerService} from './key.manager.interface';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';
import {EthereumTransaction} from '../../shared/model/ethereum-transaction';
import * as buffer from 'buffer';
import {privateKeyToAddress} from "../../shared/utils";
import * as ethutils from 'ethereumjs-util';

@Injectable()
export class PrivateKeyService implements KeyManagerService {

  private privateKey;
  private ethereumAddress;

  private privateKeyPattern = '[a-fA-F0-9]{64}';

  constructor() {
    this.resetState();
  }

  public setPrivateKey(privateKey: string) {
    if (!this.validPrivateKey(privateKey)) {
      throw new Error("Invalid privatekey");
    }
    this.privateKey = privateKey;
    this.ethereumAddress = privateKeyToAddress(this.privateKey);
  }

  /**
   * Validates whether or not a private key is valid
   * @param {string} privateKey
   * @returns {boolean & (RegExpMatchArray | null)}
   */
  public validPrivateKey(privateKey: string) {
    return !isNullOrUndefined(privateKey) && String(privateKey).match(this.privateKeyPattern);
  }

  getEthereumAddresses(): Observable<string[]> {
    // TODO: maybe upgrade this to an HD wallet
    return Observable.create(observer => {
      observer.next([this.ethereumAddress]);
      observer.complete();
    });
  }

  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    return Observable.create(observer => {
      const tx = transaction.getUnsignedTx();
      tx.sign(new buffer.Buffer(this.privateKey, 'hex'));
      const signature = ethutils.addHexPrefix(tx.serialize().toString('hex'));
      const signedTransaction = Object.assign({}, transaction);
      signedTransaction.signature = signature;
      observer.next(signedTransaction);
      observer.complete();
    });
  }

  resetState() {
    this.privateKey = '';
    this.ethereumAddress = '';
  }

  approveAndSend(transaction: EthereumTransaction): Observable<string> {
    return null;
  }

  @HostListener('window:beforeunload', ['$event'])
  onUnload($event) {
    // make sure we unload the privatekey before unloading the application
    this.resetState();
  }
}
