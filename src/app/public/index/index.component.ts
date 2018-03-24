import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';

import {DataShareService} from "../../core/data-share.service";
import {LedgerService} from '../../core/ledger.service';
import {TrezorConnectService} from '../../core/trezor-connect.service';
import {Web3Service} from "../../core/web3.service";

enum AuthState {
  none, trezor, bitbox, metamask, utcFile, privateKey, ledger
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('_recentTransactions') _recentTransactions: ElementRef;
  public AuthState = AuthState;
  public currentAuth: AuthState;

  public recentTransactions = [];
  public newTransaction = {};

  // document states
  private windowHeight: number;
  private windowWidth: number;
  private windowMin: number;
  private windowMax: number;

  // UI states
  public showQR = false;

  // Styles
  public newTransactionStyle = {};
  public newTransactionCircleStyle = {};

  @Output() ethereumAddressChange: EventEmitter<string> = new EventEmitter<string>();
  public ethereumAddress: string;

  constructor(
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
    private ledgerService: LedgerService,
    private trezorService: TrezorConnectService
  ) {
    // TODO: Update this off the bat if their MetaMask is unlocked
    this.ethereumAddress = '';
    this.dataShareService.recentTransactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });
  }

  trezorAuthState() {
    this.currentAuth = AuthState.trezor;
    this.trezorService.getEthereumAddress().subscribe((address: string) => {
      this.ethereumAddress = address;
      this.updateAddress(address);
    });
  }

  ledgerAuthState() {
    this.currentAuth = AuthState.ledger;
    this.ledgerService.getEthereumAddress().subscribe((address: string) => {
      this.ethereumAddress = address;
      this.updateAddress(address);
    });
  }

  generateTransaction() {
    this.newTransaction = this.randomTransaction();
  }

  randomTransaction() {
    const addresses = [
      '0x2a65Aca4D5fC5B5C859090a6c34d164135398226',
      '0x9034C5691E4CF92507E79a5A29D8e162b9506cD9',
      '0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c',
      '0xf73C3c65bde10BF26c2E1763104e609A41702EFE',
      '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819',
      '0x4781BEe730C9056414D86cE9411a8fb7FF02219f',
      '0x2ddb2555c3C7Ad23991125CAa4775E19b93204b9'
    ];
    const toAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const fromAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const statuses = ['processing', 'confirmed', 'failed'];
    // var status = statuses[Math.floor(Math.random()*statuses.length)]
    let status = 'processing';
    let confirmations = 0;
    if (status === 'confirmed') {
      confirmations = Math.floor(Math.random() * 20);
    }
    const tokens = ['ETH', 'SPHTX', 'WETH', 'UKG', 'THETA', 'ZRX', 'CS', 'MAN', 'REM'];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const amount = Math.floor(Math.random() * 1000000);
    return {
      'toAddress': toAddress,
      'fromAddress': fromAddress,
      'status': status,
      'confirmations': confirmations,
      'token': token,
      'amount': amount,
      'created': new Date()
    };
  }

  showApproveNewTransaction() {
    this.newTransaction = this.randomTransaction();
    // size and positionnew transaction element
    this.setNewTransactionViewFullscreen();
    // this.setNewTransactionStyle();
  }

  transactionSigned() {

    this.setNewTransactionViewToDock();

    // setTimeout(() => {
    //   this.recentTransactions.push(this.newTransaction);
    //   this.dataShareService.recentTransactions.next(this.recentTransactions);
    //   this.resetNewTransaction = true;
    //   this.showNewTransaction = false;
    //   this.setNewTransactionStyle();
    // }, 500)
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
    this.recentTransactions.push(this.randomTransaction());
    this.dataShareService.recentTransactions.next(this.recentTransactions);
    this.calibratePage();
    this.resetNewTransactionView();
  }

  fullTransactionViewCircleRadius() {
    return Math.sqrt(Math.pow(this.windowMax / 2, 2) + Math.pow(this.windowMin / 2, 2));
  }

  resetNewTransactionView() {
    const r = this.fullTransactionViewCircleRadius();
    const leftOffset = (r - this.windowWidth / 2) * -1;
    const topOffset = (r + this.windowHeight / 2 + this.windowHeight);
    const transactionTransform = 'translate(0px,' + this.windowHeight + 'px) scale(.15)';
    const circleTransform = 'translate(' + leftOffset + 'px,' + topOffset + 'px) scale(.15)';

    this.newTransactionCircleStyle['transition'] = '0s';
    this.newTransactionCircleStyle['width'] = (r * 2) + 'px';
    this.newTransactionCircleStyle['height'] = (r * 2) + 'px';

    this.newTransactionStyle['transform'] = transactionTransform;
    this.newTransactionCircleStyle['transform'] = circleTransform;
  }

  setNewTransactionViewFullscreen() {
    const r = this.fullTransactionViewCircleRadius();
    const leftOffset = (r - this.windowWidth / 2) * -1;
    const topOffset = (r - this.windowHeight / 2) * -1;
    const transactionTransform = 'translate(0,0)';
    const circleTransform = 'translate(' + leftOffset + 'px,' + topOffset + 'px) scale(1)';

    this.newTransactionCircleStyle['width'] = (r * 2) + 'px';
    this.newTransactionCircleStyle['height'] = (r * 2) + 'px';
    this.newTransactionCircleStyle['transition'] = '.5s';

    this.newTransactionStyle['opacity'] = '1';
    this.newTransactionStyle['transform'] = transactionTransform;
    this.newTransactionCircleStyle['transform'] = circleTransform;
  }

  setNewTransactionViewToDock() {

    const transactionDotSize = '12.8px';
    const transactionDotXOffset = '24px';
    const marketingHeight = this._recentTransactions.nativeElement.offsetHeight;
    const transactionYOffset = this._recentTransactions.nativeElement.offsetHeight + this._recentTransactions.nativeElement.offsetTop;
    const transactionTransform = 'translate(' + transactionDotXOffset + ',' + transactionYOffset + 'px)';
    this.newTransactionCircleStyle['transform'] = transactionTransform;
    this.newTransactionCircleStyle['height'] = transactionDotSize;
    this.newTransactionCircleStyle['width'] = transactionDotSize;

    this.newTransactionStyle['opacity'] = '0';
    setTimeout(() => {
      this.recentTransactions.push(this.newTransaction);
      this.dataShareService.recentTransactions.next(this.recentTransactions);
      this.resetNewTransactionView();
    }, 500);
  }

  calibratePage() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.windowMin = Math.min(this.windowWidth, this.windowHeight);
    this.windowMax = Math.max(this.windowWidth, this.windowHeight);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = event.target.innerHeight;
    this.windowWidth = event.target.innerWidth;
    this.calibratePage();
  }
}
