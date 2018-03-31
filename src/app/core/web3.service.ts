import { Injectable } from '@angular/core';
import Web3 from "web3";
import {Observable} from 'rxjs/Observable';
import {KeyManagerService} from './key.manager.interface';
import {EthereumTransaction} from '../shared/model/ethereum-transaction';

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

  public getBalance(address: string): Observable<number> {
    return Observable.create((observer) => {
      this.web3js.eth.getBalance(address).then((balance) => {
        observer.next(balance);
        observer.complete();
      });
    });
  }

  public getTransactions(address: string) {

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
        if (accounts.length === 0) {
          // TODO: not logged in.
          observer.error(new Error("Could not get accounts from provider"));
        } else {
          // Return default account
          // TODO: Support multiple accounts later
          observer.next(accounts[0]);
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
