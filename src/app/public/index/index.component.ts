import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
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
  @ViewChild('_recentTransactions') _recentTransactions: ElementRef;
  public AuthState = AuthState;
  public currentAuth: AuthState;
  public authed = true;
  
  // Document states
  private windowHeight: number;
  private windowWidth: number;
  private windowMin: number;
  private windowMax: number;
  
  //// UI states
  public showQR: boolean = false;
  public showNonRecommended: boolean = false;
  public showSidebar: boolean;
  // User preferences
  public userPreferences = {};
  
  // Form states
  public sendAddress: string;
  public sendAmount: number;
  public sendAsset = -1;
  public sendMax: boolean = false;
  // Modal states
  private fileUploadText: string = 'Upload UTC file';
  private showTestModal: boolean = false;
  private showUTCPasswordModal: boolean = false;
  // User info
  public recentTransactions = [];
  public newTransaction = {};
  public assets = {
    'ETH': 7.52563325,
    'tokens': [
      { 'name': 'SPHTX',
        'amount': 85671.342 },
      { 'name': 'THETA',
        'amount': 123124.52134 },
      { 'name': 'CS',
        'amount': 1231 },
      { 'name': 'MAN',
        'amount': 12453636456.44 },
      { 'name': 'UKG',
        'amount': .04 }
    ]
  }
  
  // Styles
  public newTransactionStyle = {};
  public newTransactionCircleStyle = {};
  
  @Output() ethereumAddressChange: EventEmitter<string> = new EventEmitter<string>();
  /*
  @Output() mobileChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set mobile(value) {
    this.msisdn_confirm = this.msisdn = value;
  }
  */
  public ethereumAddress: string;

  constructor (
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
    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.userPreferences = value;
    });
    this.dataShareService.showSidebar.subscribe((value: any) => {
      this.showSidebar = value;
    });
  }
  
  setShowSidebar(bool) {
    this.dataShareService.showSidebar.next(bool);
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
  }
  
  randomTransaction() {
    var addresses = ['0x2a65Aca4D5fC5B5C859090a6c34d164135398226','0x9034C5691E4CF92507E79a5A29D8e162b9506cD9','0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c','0xf73C3c65bde10BF26c2E1763104e609A41702EFE','0x8d12A197cB00D4747a1fe03395095ce2A5CC6819','0x4781BEe730C9056414D86cE9411a8fb7FF02219f','0x2ddb2555c3C7Ad23991125CAa4775E19b93204b9'];
    var toAddress = addresses[Math.floor(Math.random()*addresses.length)];
    var fromAddress = addresses[Math.floor(Math.random()*addresses.length)];
    var statuses = ['processing', 'confirmed', 'failed'];
    var status = 'processing';
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
  
  clickMaxButton() {
    this.sendMax = !this.sendMax;
    if (this.sendMax) {
      this.sendAsset == -1 ?
      this.sendAmount = this.assets['ETH']:
      this.sendAmount = this.assets['tokens'][this.sendAsset]['amount'];
    } else if (!this.sendMax) {
      this.sendAmount = null;
    }
  }
  
  sendAssetName(assetIndex) {
    let assetName = '';
    assetIndex == -1 ?
      assetName = 'ETH' :
      assetName = this.assets['tokens'][assetIndex]['name'];
    return assetName;
  }
  
  getAssetAmount(assetIndex) {
    let assetAmount;
    assetIndex == -1 ?
      assetAmount = this.assets['ETH'] :
      assetAmount = this.assets['tokens'][assetIndex]['amount'];
    return assetAmount;
  }
  
  changeSendAmount() {
    console.log(this.sendAmount);
    if (this.sendAmount < this.getAssetAmount(this.sendAsset)) {
      console.log(1);
      this.sendMax = false;
    } else if (this.sendAmount >= this.getAssetAmount(this.sendAsset)) {
      console.log(2);
      setTimeout(() => {
        this.sendAmount = this.getAssetAmount(this.sendAsset);
      }, 0)
      this.sendMax = true;
    }
  }
  
  changeSendAsset() {
    this.sendMax = false;
    this.sendAmount = null;
  }

  ngOnInit() {
    this.recentTransactions.push(this.randomTransaction());
    this.recentTransactions.push(this.randomTransaction());
    this.recentTransactions.push(this.randomTransaction());

    this.dataShareService.recentTransactions.next(this.recentTransactions);
    this.callibratePage();
    this.resetNewTransactionView();
  }
  
  fullTransactionViewCircleRadius() {
    return Math.sqrt(Math.pow(this.windowMax / 2, 2) + Math.pow(this.windowMin / 2, 2));
  }
  
  resetNewTransactionView() {
    var r = this.fullTransactionViewCircleRadius();
    var leftOffset = (r - this.windowWidth / 2) * -1;
    var topOffset = (r + this.windowHeight / 2 + this.windowHeight);
    var transactionTransform = 'translate(0px,' + this.windowHeight + 'px) scale(.15)';
    var circleTransform = 'translate(' + leftOffset + 'px,' + topOffset + 'px) scale(.15)';
    
    this.newTransactionCircleStyle['transition'] = '0s';
    this.newTransactionCircleStyle['width'] = (r * 2) + 'px';
    this.newTransactionCircleStyle['height'] = (r * 2) + 'px';
    
    this.newTransactionStyle['transform'] = transactionTransform;
    this.newTransactionCircleStyle['transform'] = circleTransform;
  }
  
  setNewTransactionViewFullscreen() {
    var r = this.fullTransactionViewCircleRadius();
    var leftOffset = (r - this.windowWidth / 2) * -1;
    var topOffset = (r - this.windowHeight / 2) * -1;
    var transactionTransform = 'translate(0,0)';
    var circleTransform = 'translate(' + leftOffset + 'px,' + topOffset + 'px) scale(1)';
    
    this.newTransactionCircleStyle['width'] = (r * 2) + 'px';
    this.newTransactionCircleStyle['height'] = (r * 2) + 'px';
    this.newTransactionCircleStyle['transition'] = '.5s';
    this.newTransactionCircleStyle['transform'] = circleTransform;
    
    this.newTransactionStyle['opacity'] = '1';
    this.newTransactionStyle['transform'] = transactionTransform;
  }
  
  setNewTransactionViewToDock() {
    var transactionDotSize = '12.8px';
    var transactionDotXOffset = '24px';
    var marketingHeight = this._recentTransactions.nativeElement.offsetHeight;
    var transactionYOffset = this._recentTransactions.nativeElement.offsetHeight + this._recentTransactions.nativeElement.offsetTop;
    var transactionTransform = 'translate(' +transactionDotXOffset + ',' + transactionYOffset + 'px)';
    this.newTransactionCircleStyle['transform'] = transactionTransform;
    this.newTransactionCircleStyle['height'] = transactionDotSize;
    this.newTransactionCircleStyle['width'] = transactionDotSize;
    
    this.newTransactionStyle['opacity'] = '0';
    
    setTimeout(() => {
      this.recentTransactions.push(this.newTransaction);
      this.dataShareService.recentTransactions.next(this.recentTransactions);
      this.resetNewTransactionView();
    }, 500)
  }
  
  utcInputChange(event: Event) {
    this.fileUploadText = event.target.files[0].name;
    this.showUTCPasswordModal = true;
  }
  
  callibratePage() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.windowMin = Math.min(this.windowWidth, this.windowHeight);
    this.windowMax = Math.max(this.windowWidth, this.windowHeight);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = event.target.innerHeight;
    this.windowWidth = event.target.innerWidth;
    this.callibratePage();
  }
}
