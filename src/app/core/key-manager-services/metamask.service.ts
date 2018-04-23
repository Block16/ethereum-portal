import { Injectable } from '@angular/core';
import {KeyManagerService} from "./key.manager.interface";
import {Observable} from "rxjs/Observable";
import Web3 from "web3";
import {EthereumTransaction} from '../../shared/model/ethereum-transaction';
import {isArray, isNullOrUndefined} from "util";

declare var web3;
declare const keythereum;

@Injectable()
export class MetamaskService implements KeyManagerService {

  public providerDetected: boolean;
  public web3js: any;

  constructor() { }

  public getEthereumAddresses(): Observable<string[]> {
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3js = new Web3(web3.currentProvider);
      this.providerDetected = true;
      console.log("Using metamask/mist provider");
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
    } else {
      // TODO: Make sure we show a notification to sign in with metamask
      throw new Error("");
    }
  }

  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    return Observable.create(observer => {
      observer.next(transaction);
      observer.complete();
    });
  }

  resetState() { }
}
