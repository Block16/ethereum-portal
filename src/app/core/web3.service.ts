import { Injectable } from '@angular/core';
import Web3 from "web3";
import {Observable} from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {EthereumTransaction} from '../shared/model/ethereum-transaction';
import {isNullOrUndefined} from "util";
import * as ethutils from 'ethereumjs-util';
import {Provider} from "../shared/model/providers";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class Web3Service {

  private providers = [
    new Provider("Infura", "https://mainnet.infura.io"),
  ];
  public currentProvider: BehaviorSubject<Provider>;

  public web3js: any;

  constructor() {
    this.currentProvider = new BehaviorSubject(this.providers[0]);
    this.web3js = new Web3(new Web3.providers.HttpProvider(this.providers[0].location));
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

  public getProviders(): Provider[] {
    return this.providers;
  }

  public getTransactionCount(account: string): Observable<any> {
    return fromPromise(this.web3js.eth.getTransactionCount(ethutils.addHexPrefix(account), 'latest'));
  }

  public sendRawTransaction(transaction: EthereumTransaction): Observable<any> {
    if (isNullOrUndefined(transaction.signature)) {
      throw new Error('Transaction signature was missing from transaction');
    }
    return Observable.create((observer) => {
      observer.next();
      observer.complete();
    });
  }

  public setCurrentProvider(p: Provider) {
    this.currentProvider.next(p);
    this.web3js = new Web3(new Web3.providers.HttpProvider(p.location));
  }
}
