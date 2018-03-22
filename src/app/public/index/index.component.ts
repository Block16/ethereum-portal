import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataShareService} from "../../core/data-share.service";
import {LedgerService} from '../../core/ledger.service';
import {TrezorConnectService} from '../../core/trezor-connect.service';
import {Web3Service} from "../../core/web3.service";

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
  
  public recentTransactions = [];
  public newTransaction = {};
  
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
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
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
      this.updateAddress(address);
    });
  }
  
  generateTransaction() {
    this.newTransaction = this.randomTransaction();
    this.showNewTransaction = true;
  }
  
  randomTransaction() {
    var addresses = ['0x2a65Aca4D5fC5B5C859090a6c34d164135398226','0x9034C5691E4CF92507E79a5A29D8e162b9506cD9','0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c','0xf73C3c65bde10BF26c2E1763104e609A41702EFE','0x8d12A197cB00D4747a1fe03395095ce2A5CC6819','0x4781BEe730C9056414D86cE9411a8fb7FF02219f','0x2ddb2555c3C7Ad23991125CAa4775E19b93204b9'];
    var toAddress = addresses[Math.floor(Math.random()*addresses.length)];
    var fromAddress = addresses[Math.floor(Math.random()*addresses.length)];
    var statuses = ['processing', 'confirmed', 'failed'];
    var status = statuses[Math.floor(Math.random()*statuses.length)]
    var confirmations = 0;
    if (status == 'confirmed') {
      confirmations = Math.floor(Math.random() * 20);
    }
    var tokens = ['ETH','SPHTX','WETH','UKG','THETA','ZRX','CS','MAN','REM'];
    var token = tokens[Math.floor(Math.random()*tokens.length)];
    var amount = Math.floor(Math.random() * 1000000);
    return {
      'toAddress': toAddress,
      'fromAddress': fromAddress,
      'status': status,
      'confirmations': confirmations,
      'token': token,
      'amount': amount,
      'created': new Date()
    }
  }
  
  transactionSigned() {
    this.showNewTransaction = false;
    this.recentTransactions.push(this.newTransaction);
    this.dataShareService.recentTransactions.next(this.recentTransactions);
  }
  
  toggleAuthState(authState: AuthState) {
    this.currentAuth = authState;
  }

  private updateAddress(address: string) {
    this.ethereumAddressChange.emit(address);
  }

  toggleMenu() {

  }

  ngOnInit() {
    this.recentTransactions.push(this.randomTransaction())
    this.dataShareService.recentTransactions.next(this.recentTransactions);
  }
}
