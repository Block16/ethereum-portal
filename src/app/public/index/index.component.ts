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
  public navLocation: string = 'history';
  public showQR = false;
  public showNonRecommended = false;
  public showApproveTransaction = false;

  public newTransactionToDock = false;
  public showTokenTray: boolean = true;

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
    private notificationService: NotificationService,
  ) {
    this.currentAuth = AuthState.none;
    this.assets = [];

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
    
    this.dataShareService.navLocation.subscribe((value: any) => {
      this.navLocation = value;
    });

    this.userPreferencesService.userPreferences.subscribe(preferences => {
      this.userPreferences = preferences;
    });

    this.coreKeyManagerService.currentAddress.subscribe((address: string) => {
      this.ethereumAddress = address;
      // TODO: refactor this, just use the subscription in the other component
      this.ethereumAddressChange.emit(address);
      // TODO: Refactor this section
    });
  }

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
      this.setNewTransactionViewToDock();
      // TODO: make sure we clear the current tx here
      // TODO: make sure we subscribe to the finish of this TX
    });
  }

  utcAuthState(event) {
    this.currentAuth = AuthState.utcFile;
    this.coreKeyManagerService.setCurrentAuth(this.currentAuth, privateKeyToAddress(event), event);
  }

  getTokenAbbreviation(tokenTicker: string) {
    console.log(tokenTicker);
    console.log(tokenTicker.substr(0, 3));
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
