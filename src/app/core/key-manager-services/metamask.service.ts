import { Injectable } from '@angular/core';
import {KeyManagerService} from "./key.manager.interface";
import {Observable} from "rxjs/Observable";
import Web3 from "web3";
import {EthereumTransaction} from '../../shared/model/ethereum-transaction';
import {isArray, isNullOrUndefined} from "util";
import {NotificationService} from "../notification.service";

declare var web3;
declare const keythereum;

@Injectable()
export class MetamaskService implements KeyManagerService {

  public providerDetected: boolean;
  public web3js: any;

  constructor(
    private notificationService: NotificationService
  ) { }

  public getEthereumAddresses(): Observable<string[]> {
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3js = new Web3(web3.currentProvider);
      this.providerDetected = true;
      return Observable.create((observer) => {
        this.web3js.eth.getAccounts().then((accounts) => {
          if (isArray(accounts) && accounts.length > 0) {
            observer.next(accounts);
          } else if (!isArray(accounts) && !isNullOrUndefined(accounts)) {
            observer.next(accounts);
          } else {
            this.notificationService.error("Please unlock metamask and select this option again.", "MetaMask");
            observer.error(new Error("Could not get accounts from provider"));
          }
          observer.complete();
        }, err => {
          observer.error(err);
          observer.complete();
        });
      });
    } else {
      this.notificationService.error("MetaMask", "Please install metamask before using this option.");
    }
  }

  /**
   * Identity sign TX function as it will have to be approved
   * @param {EthereumTransaction} transaction
   * @returns {Observable<EthereumTransaction>}
   */
  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    return Observable.create(observer => {
      observer.next(transaction);
      observer.complete();
    });
  }

  /**
   *
   * @param {EthereumTransaction} transaction
   * @returns {Observable<string>}
   */
  approveAndSend(transaction: EthereumTransaction): Observable<string> {
    return Observable.create(observer => {
      const unsigned = transaction.getUnsignedObject();
      this.web3js.eth.sendTransaction(unsigned, (err, txHash) => {
        if (!err) {
          observer.next(txHash);
        } else {
          observer.error(err);
        }
        observer.complete();
      });
    });
  }

  resetState() { }
}
