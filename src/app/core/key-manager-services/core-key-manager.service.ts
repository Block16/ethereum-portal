import { Injectable } from '@angular/core';
import {KeyManagerService} from "./key.manager.interface";
import {Observable} from "rxjs/Observable";
import {EthereumTransaction} from "../../shared/model/ethereum-transaction";
import {LedgerService} from "./ledger.service";
import {MetamaskService} from "./metamask.service";
import {PrivateKeyService} from "./private-key.service";
import {TrezorConnectService} from "./trezor-connect.service";
import {AuthState} from "../../shared/model/auth-state";
import {isNullOrUndefined} from "util";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class CoreKeyManagerService implements KeyManagerService {
  public currentAddress: BehaviorSubject<string>;

  // TODO: Should we keep the list of addresses here?
  private addresses: string[];

  private currentKeyManager: KeyManagerService;
  private currentAuth: AuthState;

  constructor(
    private ledgerService: LedgerService,
    private metamaskService: MetamaskService,
    private privateKeyService: PrivateKeyService,
    private trezorConnectService: TrezorConnectService
  ) {
    this.currentAuth = AuthState.none;
    this.currentAddress = new BehaviorSubject<string>('');
  }

  setCurrentAuth(currentAuth: AuthState, address: string, privateKey?: string) {
    this.currentAuth = currentAuth;
    // set the current address
    debugger;
    this.currentAddress.next(address);

    switch (this.currentAuth) {
      case AuthState.privateKey: {
        this.currentKeyManager = this.privateKeyService;
        if (isNullOrUndefined(privateKey)) {
          throw new Error('Privatekey was not defined');
        }
        this.privateKeyService.setPrivateKey(privateKey);
        break;
      }
      case AuthState.metamask: {
        this.currentKeyManager = this.metamaskService;
        break;
      }
      case AuthState.trezor: {
        this.currentKeyManager = this.trezorConnectService;
        break;
      }
      case AuthState.utcFile: {
        this.currentKeyManager = this.privateKeyService;
        if (isNullOrUndefined(privateKey)) {
          throw new Error('Privatekey was not defined');
        }
        this.privateKeyService.setPrivateKey(privateKey);
        break;
      }
      case AuthState.none: {
        this.currentKeyManager = undefined;
        break;
      }
    }
  }

  getEthereumAddresses(): Observable<string[]> {
    if (isNullOrUndefined(this.currentKeyManager)) {
      throw new Error('currentKeyManager is not defined, cannot call service methods without a privatekey manager');
    }
    return this.currentKeyManager.getEthereumAddresses();
  }

  approveAndSend(transaction: EthereumTransaction): Observable<string> {
    return this.currentKeyManager.approveAndSend(transaction);
  }

  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction> {
    if (isNullOrUndefined(this.currentKeyManager)) {
      throw new Error('currentKeyManager is not defined, cannot call service methods without a privatekey manager');
    }
    return this.currentKeyManager.signTransaction(transaction);
  }

  resetState() {
    this.setCurrentAuth(AuthState.none, '');
    this.privateKeyService.resetState();
  }
}
