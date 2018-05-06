import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataShareService} from "../../core/data-share.service";
import {LedgerService} from '../../core/key-manager-services/ledger.service';
import {TrezorConnectService} from '../../core/key-manager-services/trezor-connect.service';
import {Web3Service} from "../../core/web3.service";
import {privateKeyToAddress} from "../../shared/utils";
import {PrivateKeyService} from "../../core/key-manager-services/private-key.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";
import {Subscription} from "rxjs/Subscription";
import {Block16Service} from "../../core/block16.service";
import {EthereumAsset} from "../../shared/model/ethereum-asset";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {UserPreferences} from "../../shared/model/user-preferences";
import {AuthState} from '../../shared/model/auth-state';
import {CoreKeyManagerService} from "../../core/key-manager-services/core-key-manager.service";
import {EthereumTransaction} from "../../shared/model/ethereum-transaction";
import {DenominationService} from "../../core/denomination.service";
import {TokenTickerService} from "../../core/token-ticker.service";
import {NotificationService} from '../../core/notification.service';
import {BigNumber} from "bignumber.js";
import {MetamaskService} from "../../core/key-manager-services/metamask.service";
import {isNullOrUndefined} from "util";

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
  public showApproveTransaction = false;

  public newTransactionToDock = false;

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
  public newTransaction: EthereumTransaction;

  // Styles
  public newTransactionStyle = {};
  public newTransactionCircleStyle = {};

  // Test Var
  public testAsset = new EthereumAsset("ZRX", "ZRX", new BigNumber('10304433223444'), 5, "0x0d8775f648430679a709e98d2b0cb6250d2887ef", 65000);

  @Output() ethereumAddressChange: EventEmitter<string> = new EventEmitter<string>();
  public ethereumAddress: string;
  public ethereumBalance: number;

  constructor(
    private block16Api: Block16Service,
    private themeService: ThemeService,
    private userPreferencesService: UserPreferencesService,
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
    private ledgerService: LedgerService,
    private trezorService: TrezorConnectService,
    private metaMaskService: MetamaskService,
    private assetService: Block16Service,
    private coreKeyManagerService: CoreKeyManagerService,
    private privateKeyService: PrivateKeyService,
    private denominationService: DenominationService,
    private tokenTickerService: TokenTickerService,
    public notificationService: NotificationService
  ) {
    this.currentAuth = AuthState.none;

    // TODO: Update this off the bat if their MetaMask is unlocked
    this.ethereumAddress = '';
    this.ethereumBalance = 0;

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

    this.coreKeyManagerService.currentAddress.subscribe((address: string) => {
      this.ethereumAddress = address;
      // TODO: refactor this, just use the subscription in the other component
      this.ethereumAddressChange.emit(address);
      // TODO: Refactor this section
      // Go fetch the balance of the address immediately, TODO: refactor this into the assets call
      /*this.web3Service.getBalance(address).subscribe((balance) => {
        this.ethereumBalance = balance;
      }); */
    });
  }

  private denominate(asset, amount, denomination) {
    return this.denominationService.denominate(asset, amount, denomination);
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

  /**
   * When the send-form emits a generated transaction
   * @param {EthereumTransaction} transaction that was generated
   */
  onTransactionGenerated(transaction: EthereumTransaction) {
    this.newTransaction = transaction;
    this.showApproveTransaction = true;
    this.setNewTransactionViewFullscreen();
    // Want single approve step, for non-privateKey this will open on their device
    // TODO: I don't like this control flow (AJD)
    if (this.currentAuth !== AuthState.privateKey && this.currentAuth !== AuthState.utcFile) {
      this.coreKeyManagerService.approveAndSend(this.newTransaction).subscribe((txHash) => {
        console.log(txHash);
        this.setNewTransactionViewToDock();
        // TODO: make sure we clear the current tx here
        // TODO: make sure we subscribe to the finish of this TX
      });
    }
  }

  sendTransaction() {
    // TODO: I don't like this control flow (AJD)
    this.web3Service.sendRawTransaction(this.newTransaction).subscribe(txHash => {
      console.log(txHash);
      this.setNewTransactionViewToDock();
      // TODO: make sure we clear the current tx here
      // TODO: make sure we subscribe to the finish of this TX
    });
  }

  setShowSidebar(bool) {
    this.dataShareService.showSidebar.next(bool);
  }

  utcAuthState(event) {
    this.currentAuth = AuthState.utcFile;
    this.coreKeyManagerService.setCurrentAuth(this.currentAuth, privateKeyToAddress(event), event);
  }

  getTokenAbbreviation(tokenTicker: string) {
    return tokenTicker.substr(0, 3).toUpperCase();
  }

  tokenHasIcon(contractAddress) {
    return !!this.tokenTickerService.checkTokenSymbol(contractAddress);
  }

  privateKeyAuthState(event) {
    this.currentAuth = AuthState.privateKey;
    this.coreKeyManagerService.setCurrentAuth(this.currentAuth, privateKeyToAddress(event.privateKey), event.privateKey);
  }

  metaMaskAuthState() {
    this.metaMaskService.getEthereumAddresses().subscribe((addresses: string[]) => {
      this.currentAuth = AuthState.metamask;
      this.coreKeyManagerService.setCurrentAuth(this.currentAuth, addresses[0]);

    });
  }

  trezorAuthState() {
    this.trezorService.getEthereumAddresses().subscribe((addresses: string[]) => {
      this.currentAuth = AuthState.trezor;
      this.coreKeyManagerService.setCurrentAuth(this.currentAuth, addresses[0]);
    });
  }

  ledgerAuthState() {
    this.ledgerService.displayOnLedger().subscribe((r) => {
      this.ledgerService.getEthereumAddress().subscribe((address: string) => {
        this.currentAuth = AuthState.ledger;
        this.coreKeyManagerService.setCurrentAuth(this.currentAuth, address);

        this.ethereumAddress = address;
        // this.updateAddress(address);
      });
    });
    /* this.ledgerService.getEthereumAddress().subscribe((address: string) => {
      this.ethereumAddress = address;
      this.updateAddress(address);
    }); */
  }

  generateTransaction() {
    // this.newTransaction = this.randomTransaction();
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
    // this.newTransaction = this.randomTransaction();
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
