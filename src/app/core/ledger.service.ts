import { Injectable } from '@angular/core';
import Transport from '@ledgerhq/hw-transport-u2f';
// import Transport from "@ledgerhq/hw-transport-node-hid";
import Eth from '@ledgerhq/hw-app-eth';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';

@Injectable()
export class LedgerService {

  // Don't use these instance variables in the functions
  private transport: Transport;
  private eth: Eth;

  constructor() { }

  private getEthInstance(): Observable<Eth> {
    return Observable.create(observer => {
      this.getTransport().subscribe(transport => {
        if (isNullOrUndefined(this.eth)) {
          this.eth = new Eth(transport);
        }
        observer.next(this.eth);
        observer.complete();
      });
    });
  }

  /**
   * Get the browser UF2 transport
   * @returns {Observable<>}
   */
  private getTransport(): Observable<Transport> {
    return Observable.create(observer => {
      if (isNullOrUndefined(this.transport)) {
        Transport.create().then(transport => {
          this.transport = transport;
          observer.next(this.transport);
          observer.complete();
        });
      } else {
        observer.next(this.transport);
        observer.complete();
      }
    });
  }

  public getEthereumAddress(): Observable<string> {
    return Observable.create(observer => {
      this.getEthInstance().subscribe(eth => {
        this.eth.getAddress("44'/60'/0'/0'/0").then(o => {
          observer.next(o.address);
          observer.complete();
        }, err => {
          console.log("Couldn't get ethereum address from ledger");
          console.log(err);
          observer.error(err.toString());
          observer.complete();
        });
      });
    });
  }

}
