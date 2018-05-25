import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {EthereumTransaction} from '../shared/model/ethereum-transaction';
import {isNullOrUndefined} from "util";
import * as ethutils from 'ethereumjs-util';
import {Provider} from "../shared/model/providers";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BigNumber} from "bignumber.js";

declare var Web3;

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

  public getTokenBalance(contractAddress: string, userAddress: string): Observable<BigNumber> {
    const balanceFn = this.web3js.eth.abi.encodeFunctionCall({
      "constant": true,
      "inputs": [{"name": "_owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance", "type": "uint256"}],
      "payable": false,
      "type": "function"
    }, [ethutils.addHexPrefix(userAddress)]);

    // TODO: Find out what happens if the contract doesn't have this value...
    return fromPromise(this.web3js.eth.call({
      to: ethutils.addHexPrefix(contractAddress),
      data: balanceFn
    })).map((n: string) => new BigNumber(n.substring(2), 16));
  }

  public getTransactionReciept(txHash: string): Observable<any> {
    return fromPromise(this.web3js.eth.getTransactionReceipt(txHash));
  }

  public getTransactionCount(account: string): Observable<any> {
    return fromPromise(this.web3js.eth.getTransactionCount(ethutils.addHexPrefix(account), 'latest'));
  }

  public sendRawTransaction(transaction: EthereumTransaction): Observable<string> {
    if (isNullOrUndefined(transaction.signature)) {
      throw new Error('Transaction signature was missing');
    }
    return Observable.create((observer) => {
      this.web3js.eth.sendRawTransaction(transaction.signature, (err, txHash) => {
        if (!isNullOrUndefined(err)) {
          observer.error(err);
        } else {
          observer.next(txHash);
        }
        observer.complete();
      });
    });
  }

  public setCurrentProvider(p: Provider) {
    this.currentProvider.next(p);
    this.web3js = new Web3(new Web3.providers.HttpProvider(p.location));
  }

  public getDecimals(a: string): Observable<number> {
    const tokenFn = this.web3js.eth.abi.encodeFunctionSignature('decimals()');
    return fromPromise(this.web3js.eth.call({
      to: ethutils.addHexPrefix(a),
      data: tokenFn
    })).map((r: string) => {
      // TODO: Find out what happens if the contract doesn't have this value...
      return new BigNumber(r.substring(2), 16).toNumber();
    });
  }

  public getTokenSymbol(a: string): Observable<string> {
    const tokenFn = this.web3js.eth.abi.encodeFunctionSignature('symbol()');
    return fromPromise(this.web3js.eth.call({
      to: ethutils.addHexPrefix(a),
      data: tokenFn
    })).map((r: string) => {
      // TODO: Find out what happens if the contract doesn't have this value...
      return this.web3js.utils.hexToAscii(r).replace(/[^\x20-\x7F]/g, "").trim();
    });
  }

  public getTokenName(a: string): Observable<string> {
    const nameFn = this.web3js.eth.abi.encodeFunctionSignature('name()');
    return fromPromise(this.web3js.eth.call({
      to: ethutils.addHexPrefix(a),
      data: nameFn
    })).map((r: string) => {
      // TODO: Find out what happens if the contract doesn't have this value...
      return this.web3js.utils.hexToAscii(r).replace(/[^\x20-\x7F]/g, "").trim();
    });
  }
}
