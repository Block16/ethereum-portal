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
  public ethereumAddress: string;

  constructor(
    private ledgerService: LedgerService,
    private trezorService: TrezorConnectService
  ) {
    // TODO: Update this off the bat if their MetaMask is unlocked
    this.ethereumAddress = '';
  }

  trezorAuthState() {
    this.currentAuth = AuthState.trezor;
    this.trezorService.getEthereumAddress().subscribe((address: string) => {
      this.ethereumAddress = address;
    });
  }

  toggleAuthState(authState: AuthState) {
    this.currentAuth = authState;
  }

  toggleMenu() {

  }

  ngOnInit() {
  }
}
