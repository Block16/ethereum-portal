import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  public showQR: boolean = false;
  
  // Styles
  public newTransactionStyle = {};
  
  @Output() ethereumAddressChange: EventEmitter<string> = new EventEmitter<string>();
  /*
  @Output() mobileChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set mobile(value) {
    this.msisdn_confirm = this.msisdn = value;
  }
  */
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
      this.ethereumAddressChange.emit(address);
    });
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
