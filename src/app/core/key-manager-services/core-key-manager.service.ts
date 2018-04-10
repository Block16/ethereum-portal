import { Injectable } from '@angular/core';
import {KeyManagerService} from "./key.manager.interface";
import {Observable} from "rxjs/Observable";
import {EthereumTransaction} from "../../shared/model/ethereum-transaction";
import {LedgerService} from "./ledger.service";
import {MetamaskService} from "./metamask.service";
import {PrivateKeyService} from "./private-key.service";
import {TrezorConnectService} from "./trezor-connect.service";

@Injectable()
export class CoreKeyManagerService implements KeyManagerService {

  private currentKeyManager: KeyManagerService;
  private currentAuth;

  constructor(
    private ledgerService: LedgerService,
    private metamaskService: MetamaskService,
    private privateKeyService: PrivateKeyService,
    private trezorConnectService: TrezorConnectService
  ) { }

  setCurrentAuth(currentAuth) {
    this.currentAuth = currentAuth;
  }

  getEthereumAddresses(): Observable<string[]> {
    return null;
  }

  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    return null;
  }

  resetState() {
  }
}
