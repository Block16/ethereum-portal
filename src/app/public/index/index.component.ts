import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {DataShareService} from "../../core/data-share.service";
import {LedgerService} from '../../core/key-manager-services/ledger.service';
import {TrezorConnectService} from '../../core/key-manager-services/trezor-connect.service';
import {Web3Service} from "../../core/web3.service";
import {privateKeyToAddress} from "../../shared/utils";
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

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild('_recentTransactions') _recentTransactions: ElementRef;
  @Output() showSidebarChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public AuthState = AuthState;
  public currentAuth: AuthState;

  // Document states
  private windowHeight: number;
  private windowWidth: number;
  private windowMin: number;
  private windowMax: number;

  // UI states
  public navLocation = 'history';
  public showQR = false;
  public showNonRecommended = false;
  public showApproveTransaction = false;
  public newTransactionToDock = false;
  public showTokenTray = true;

  // User preferences
  private userPreferencesSubscription: Subscription;
  public userPreferences: UserPreferences;
  private themeSubscription: Subscription;
  public theme: Theme;

  // Form states
  public sendAddress: string;
  public sendAmount: number;
  public sendAsset = -1;

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

  public ethereumAddress: string;
  public ethereumBalance: number;
  private ethereumAddressSubscription: Subscription;

  constructor(
    private themeService: ThemeService,
    private userPreferencesService: UserPreferencesService,
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
    private ledgerService: LedgerService,
    private trezorService: TrezorConnectService,
    private metaMaskService: MetamaskService,
    private block16Service: Block16Service,
    private coreKeyManagerService: CoreKeyManagerService,
    private denominationService: DenominationService,
    private tokenTickerService: TokenTickerService,
    private notificationService: NotificationService,
  ) {
    this.currentAuth = AuthState.none;
    this.assets = [];

    this.ethereumAddress = '';
    this.ethereumBalance = 0;

    // Theme
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
      this.themeService.updateSVGs(theme);
    });

    // Assets
    this.assetSubscription = this.block16Service.ethereumAssets.subscribe(assets => {
      this.assets = assets;
    });

    this.block16Service.transactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });

    // TODO: shouldn't this be managed by URLs instead of a service?
    this.dataShareService.navLocation.subscribe((value: any) => {
      if (value == 'send' && this.navLocation !== 'send') {
        this.setNewTransactionViewCenter();
      }
      this.navLocation = value;
    });

    this.userPreferencesSubscription = this.userPreferencesService.userPreferences.subscribe(preferences => {
      this.userPreferences = preferences;
    });

    this.ethereumAddressSubscription = this.coreKeyManagerService.currentAddress.subscribe((address: string) => {
      this.ethereumAddress = address;
    });
  }

  // TODO: i18n library for this? (AJD)
  private denominate(asset, amount, denomination) {
    return this.denominationService.denominate(asset, amount, denomination);
  }

  ngOnInit(): void {
    this.calibratePage();
    this.resetNewTransactionView();
    this.metaMaskAuthState();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.assetSubscription.unsubscribe();
    this.userPreferencesSubscription.unsubscribe();
    this.ethereumAddressSubscription.unsubscribe();
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
        this.newTransaction.hash = txHash;
        this.setNewTransactionViewToDock();
        this.block16Service.newRecentTransaction(this.newTransaction);

        // TODO: make sure we clear the current tx here
        // TODO: make sure we subscribe to the finish of this TX
      }, (err) => {
        console.log(err);
        this.notificationService.message("Canceled by user.", "Transaction Status");
        this.resetNewTransactionView();
      });
    }
  }

  clickTokenTray() {
    if (this.windowWidth < this.dataShareService.tabletMaxBreakPoint) {
      this.showTokenTray = !this.showTokenTray;
    }
  }

  sendTransaction() {
    // TODO: I don't like this control flow (AJD)
    this.web3Service.sendRawTransaction(this.newTransaction).subscribe(txHash => {
      this.newTransaction.hash = txHash;
      this.setNewTransactionViewToDock();
      this.block16Service.newRecentTransaction(this.newTransaction);
      // TODO: make sure we clear the current tx here
      // TODO: make sure we subscribe to the finish of this TX
    });
  }

  setShowSidebar(b: boolean) {
    this.showSidebarChange.emit(b);
  }

  utcAuthState(event) {
    this.currentAuth = AuthState.utcFile;
    this.coreKeyManagerService.setCurrentAuth(this.currentAuth, privateKeyToAddress(event), event);
  }

  getTokenAbbreviation(tokenTicker: string) {
    return tokenTicker.substr(0, 3).toUpperCase();
  }

  tokenHasIcon(contractAddress) {
    // debugger;
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

  showApproveNewTransaction() {
    // this.newTransaction = this.randomTransaction();
    // size and positionnew transaction element
    this.setNewTransactionViewFullscreen();
    // this.setNewTransactionStyle();
  }

  transactionSigned() {
    this.setNewTransactionViewToDock();
    // setTimeout(() => {
    //   this.transactions.push(this.newTransaction);
    //   this.dataShareService.transactions.next(this.transactions);
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

  setNewTransactionViewCenter() {
    console.log('setNewTransactionViewCenter()');
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
    // const marketingHeight = this._recentTransactions.nativeElement.offsetHeight;
    // const transactionYOffset = this._recentTransactions.nativeElement.offsetHeight + this._recentTransactions.nativeElement.offsetTop;
    const transactionYOffset = '0';
    this.newTransactionCircleStyle['transform'] = 'translate(' + transactionDotXOffset + ',' + transactionYOffset + 'px)';
    this.newTransactionCircleStyle['height'] = transactionDotSize;
    this.newTransactionCircleStyle['width'] = transactionDotSize;

    this.newTransactionStyle['opacity'] = '0';

    setTimeout(() => {
      this.resetNewTransactionView();
    }, 500);
  }

  resizeTokenTray() {
    if (this.windowWidth > this.dataShareService.tabletMaxBreakPoint) {
      this.showTokenTray = true;
    }
  }

  calibratePage() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.windowMin = Math.min(this.windowWidth, this.windowHeight);
    this.windowMax = Math.max(this.windowWidth, this.windowHeight);
    this.resizeTokenTray();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = event.target.innerHeight;
    this.windowWidth = event.target.innerWidth;
    this.calibratePage();
  }
}
