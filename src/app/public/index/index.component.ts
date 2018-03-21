import { Component, OnInit } from '@angular/core';
import {LedgerService} from '../../core/ledger.service';
import {TrezorConnectService} from '../../core/trezor-connect.service';

enum AuthState {
  trezor, bitbox, metamask, utcFile, privateKey, ledger
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public AuthState = AuthState;
  public currentAuth: AuthState;
  
  // UI states
  public showNewTransaction: boolean = false;
  
  // Styles
  public newTransactionStyle = {};

  constructor(
    private ledgerService: LedgerService,
    private trezorService: TrezorConnectService
  ) {

  }
  
  transactionSigned() {
    this.showNewTransaction = false;
  }
  
  toggleAuthState(authState: AuthState) {
    this.currentAuth = authState;
  }

  toggleMenu() {

  }

  ngOnInit() {
  }
}
