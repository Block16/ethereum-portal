import { Injectable } from '@angular/core';
import {KeyManagerService} from "./key.manager.interface";
import {Observable} from "rxjs/Observable";
import {EthereumTransaction} from "../../shared/model/ethereum-transaction";

@Injectable()
export class MetamaskService implements KeyManagerService {

  constructor() { }


  getEthereumAddresses(): Observable<string[]> {
    return null;
  }

  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    return null;
  }

  resetState() {
  }
}
