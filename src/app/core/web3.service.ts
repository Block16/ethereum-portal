import { Injectable } from '@angular/core';
import Web3 from "web3";
import {Observable} from 'rxjs/Observable';
import {KeyManagerService} from './key-manager-services/key.manager.interface';
import {EthereumTransaction} from '../shared/model/ethereum-transaction';
import {isArray, isNullOrUndefined} from "util";

declare var web3;
declare const keythereum;

@Injectable()
export class Web3Service implements KeyManagerService {
  public providerDetected: boolean;

  public web3js: any;
  public infuraLocation = "https://mainnet.infura.io";

  constructor() {
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3js = new Web3(web3.currentProvider);
      this.providerDetected = true;
      console.log("Using metamask/mist provider");
    } else {
      // Not using metamask
      this.web3js = new Web3(new Web3.providers.HttpProvider(this.infuraLocation));
      this.providerDetected = false;
      console.log("Using infura provider");
    }
  }

  public getWebInstance(): any {
    return this.web3js;
  }

  public getBalance(address: string): Observable<number> {
    return Observable.create((observer) => {
      this.web3js.eth.getBalance(address).then((balance) => {
        observer.next(balance);
        observer.complete();
      });
    });
  }

  public getTransactionCount(account: string): Observable<number> {
    return this.web3js.eth.getTransactionCount(account);
  }

  public sendRawTransaction(transaction: EthereumTransaction): Observable<any> {
    return Observable.create((observer) => {

      observer.next();
      observer.complete();
    });
  }

  ////////
  //// Key Mgmt Functions
  ////////

  public getEthereumAddresses(): Observable<string[]> {
    return Observable.create((observer) => {
      this.web3js.eth.getAccounts().then((accounts) => {
        if (isArray(accounts) && accounts.length > 0) {
          observer.next(accounts);
        } else if (!isArray(accounts) && !isNullOrUndefined(accounts)) {
          observer.next(accounts);
        } else {
          // TODO: not logged in.
          observer.error(new Error("Could not get accounts from provider"));
        }
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });
  }

  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    return Observable.create(observer => {
      observer.next(transaction);
      observer.complete();
    });
  }

  /**
   * Not necessary here since we don't keep any state
   */
  resetState() { }
}
