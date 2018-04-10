import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataShareService} from "../../core/data-share.service";
import {LedgerService} from '../../core/key-manager-services/ledger.service';
import {TrezorConnectService} from '../../core/key-manager-services/trezor-connect.service';
import {Web3Service} from "../../core/web3.service";
import {privateKeyToAddress} from "../../shared/utils";
import {PrivateKeyService} from "../../core/key-manager-services/private-key.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThemeService} from "../../core/theme.service";
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../../shared/model/theme/theme";
import {EthereumAssetService} from "../../core/ethereum-asset.service";
import {EthereumAsset} from "../../shared/model/ethereum-asset";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {UserPreferences} from "../../shared/model/user-preferences";


enum AuthState {
  none, trezor, bitbox, metamask, utcFile, privateKey, ledger
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild('_recentTransactions') _recentTransactions: ElementRef;
  public AuthState = AuthState;
  public currentAuth: AuthState;

  // Document states
  private windowHeight: number;
  private windowWidth: number;
  private windowMin: number;
  private windowMax: number;

  // UI states
  public showQR = false;
  public showNonRecommended = false;
  public showSidebar: boolean;
  public detectedInjectedProvider: boolean;

  // User preferences
  private userPreferencesSubscription: Subscription;
  public userPreferences: UserPreferences;
  private themeSubscription: Subscription;
  public theme: Theme;

  // Form states
  public sendForm: FormGroup;
  public sendAddress: string;
  public sendAmount: number;
  public sendAsset = -1;
  public sendMax = false;

  // Modal states
  public showTestModal = false;

  // User info
  private assetSubscription: Subscription;
  public assets: EthereumAsset[];
  public recentTransactions = [];
  public newTransaction = {};

  // Styles
  public newTransactionStyle = {};
  public newTransactionCircleStyle = {};

  @Output() ethereumAddressChange: EventEmitter<string> = new EventEmitter<string>();
  public ethereumAddress: string;
  public ethereumBalance: number;

  constructor (
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private userPreferencesService: UserPreferencesService,
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
    private ledgerService: LedgerService,
    private trezorService: TrezorConnectService,
    private privateKeyService: PrivateKeyService,
    private assetService: EthereumAssetService,
  ) {
    this.currentAuth = AuthState.none;

    // TODO: Update this off the bat if their MetaMask is unlocked
    this.ethereumAddress = '';
    this.ethereumBalance = 0;

    // If we detected metamask or mist
    this.detectedInjectedProvider = this.web3Service.providerDetected;

    // Theme
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
      this.themeService.updateSVGs(theme);
      // this.updateSVGs('blue');
    });

    
    // Assets
    this.assetSubscription = this.assetService.ethereumAssets.subscribe(assets => {
      this.assets = assets;
    });

    // TODO: pull this out
    this.dataShareService.recentTransactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });

    this.userPreferencesService.userPreferences.subscribe(preferences => {
      this.userPreferences = preferences;
    });

    this.dataShareService.showSidebar.subscribe((value: any) => {
      this.showSidebar = value;
    });
  }
  
  test() {
    console.log('test');
  }

  ngOnInit(): void {
    this.recentTransactions.push(this.randomTransaction());
    this.recentTransactions.push(this.randomTransaction());
    this.recentTransactions.push(this.randomTransaction());
    this.dataShareService.recentTransactions.next(this.recentTransactions);
    this.calibratePage();
    this.resetNewTransactionView();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  setShowSidebar(bool) {
    this.dataShareService.showSidebar.next(bool);
  }

  utcAuthState(event) {
    this.currentAuth = AuthState.utcFile;
    this.updatePrivateKey(event);
  }

  privateKeyAuthState(event) {
    this.currentAuth = AuthState.privateKey;
    this.updatePrivateKey(event.privateKey);
  }

  metaMaskAuthState() {
    this.web3Service.getEthereumAddresses().subscribe((addresses: string[]) => {
      this.currentAuth = AuthState.metamask;
      this.updateAddress(addresses[0]);
    });
  }

  trezorAuthState() {
    this.trezorService.getEthereumAddresses().subscribe((addresses: string[]) => {
      this.currentAuth = AuthState.trezor;
      this.updateAddress(addresses[0]);
    });
  }

  ledgerAuthState() {
    this.currentAuth = AuthState.ledger;
    this.ledgerService.displayOnLedger().subscribe((r) => {
      this.ledgerService.getEthereumAddress().subscribe((address: string) => {
        this.ethereumAddress = address;
        this.updateAddress(address);
      });
    });
    /* this.ledgerService.getEthereumAddress().subscribe((address: string) => {
      this.ethereumAddress = address;
      this.updateAddress(address);
    }); */
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
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let confirmations = 0;
    if (status == 'confirmed') {
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

  private updatePrivateKey(privateKey: string) {
    this.updateAddress(privateKeyToAddress(privateKey));
    this.privateKeyService.setPrivateKey(privateKey);
  }

  private updateAddress(address: string) {
    this.ethereumAddress = address;
    this.ethereumAddressChange.emit(address);

    // Go fetch the balance of the address immediately, TODO: refactor this into the assets call
    this.web3Service.getBalance(address).subscribe((balance) => {
      this.ethereumBalance = balance;
    });

    // Go fetch the assets for the new address
    this.assetService.updateAddress(address);
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
    this.newTransactionCircleStyle['transform'] = circleTransform;

    this.newTransactionStyle['opacity'] = '1';
    this.newTransactionStyle['transform'] = transactionTransform;
  }

  setNewTransactionViewToDock() {
    const transactionDotSize = '12.8px';
    const transactionDotXOffset = '24px';
    const marketingHeight = this._recentTransactions.nativeElement.offsetHeight;
    const transactionYOffset = this._recentTransactions.nativeElement.offsetHeight + this._recentTransactions.nativeElement.offsetTop;
    this.newTransactionCircleStyle['transform'] = 'translate(' + transactionDotXOffset + ',' + transactionYOffset + 'px)';
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

  @HostListener('window:beforeunload', ['$event'])
  onUnload($event) {

  }
}
