import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';
import {LedgerTransport} from "../shared/ledger-transport";
import {LedgerEth} from "../shared/ledger-eth";
import * as EthTx from 'ethereumjs-tx';

declare const Buffer;
declare const TrezorConnect;
declare const keythereum;

declare let u2f;

@Injectable()
export class LedgerService {

  // Don't use these instance variables in the functions
  private transport: LedgerTransport;
  private eth: LedgerEth;

  constructor() {
    this.transport = new LedgerTransport("w0w", 60);
  }

  /* private getEthInstance(): Observable<any> {
    return Observable.create(observer => {
      this.getTransport().subscribe(transport => {
        if (isNullOrUndefined(this.eth)) {
          this.eth = new LedgerEth(transport);
        }
        observer.next(this.eth);
        observer.complete();
      });
    });
  }

  /**
   * Get the browser UF2 transport
   * @returns {Observable<>}

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
  } */

  private getEthInstance(): Observable<any> {
    return Observable.create(observer => {
      if (isNullOrUndefined(this.eth)) {
        this.eth = new LedgerEth(this.transport);
      }
      observer.next(this.eth);
      observer.complete();
    });
  }

  public displayOnLedger() {
    return Observable.create(obs => {
      this.getEthInstance().subscribe(eth => {
        eth.getAddress("m/44'/60'/0'", true, false).subscribe((r) => {
          console.log("ok");
          obs.next("ok");
          obs.complete();
        }, err => {
          console.log(err);
          obs.error(err);
          obs.complete();
        });
      });
    });
  }

  public getEthereumAddress(): Observable<string> {
    return Observable.create(observer => {
      this.getEthInstance().subscribe(eth => {
        eth.getAddress("m/44'/60'/0'").subscribe(o => {
          observer.next(o.address);
          observer.complete();
        }, err => {
          console.log("Couldn't get ethereum address from ledger");
          if (!isNullOrUndefined(err.errorCode)) {
            console.log(u2f.getErrorByCode(err.errorCode));
          }
          console.log(err);
          observer.error(err.toString());
          observer.complete();
        });
      });
    });
  }

}
