import {
  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, Self, ViewChild,
  ViewChildren
} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";
import {Block16Service} from "../../core/block16.service";
import {TransactionEntryComponent} from "./transaction-entry/transaction-entry.component";
import {DataShareService} from "../../core/data-share.service";
import {TransactionService, ListWidths} from "./transaction.service";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit, OnDestroy {
	public transactions = [];
  public theme: Theme;
  private themeSubscription: Subscription;
  public widestWidthsSubscription: Subscription;
  private transactionSubscription: Subscription;

  public assetWidths = [];
  public blockWidths = [];
  public timeWidths = [];

  public entryStyle = null;
  public assetStyle = null;
  public blockStyle = null;
  public timeStyle = null;

  public widestWidthStyles = {
    'entryStyle': {},
    'assetStyle': {},
    'blockStyle': {},
    'timeStyle': {}
  };

  public widestWidths = {
    'asset': null,
    'block': null,
    'time': null
  };
  
  public dotInfo = {};
  
  @Input('incomingTx') incomingTx: boolean = false;
  @Output() dotLocation: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('asset') _asset: ElementRef;
  @ViewChild('block') _block: ElementRef;
  @ViewChild('time') _time: ElementRef;

  @ViewChildren(TransactionEntryComponent) transactionEntries: QueryList<TransactionEntryComponent>;

  public window = {'width': window.innerWidth, 'height': window.innerHeight};

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.window.width = event.target.innerWidth;
      this.window.height = event.target.innerHeight;
      this.setWidthStyles(this.widestWidths);
  }

  constructor(
    @Self() private host: ElementRef,
    private themeService: ThemeService,
    private block16Service: Block16Service,
    private txs: TransactionService,
    public data: DataShareService
  ) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });

    this.widestWidthsSubscription = this.txs.widestWidths.subscribe(widestWidths => {
      this.setWidthStyles(widestWidths);
      this.widestWidths = widestWidths;
    });

    this.transactionSubscription = this.block16Service.recentTransactions.subscribe((txs) => {
      this.transactions = txs;
      this.setWidestWidths();
    });

  }

  entryLoaded(itemWidths) {
    this.assetWidths.push(itemWidths.asset);
    this.blockWidths.push(itemWidths.block);
    this.timeWidths.push(itemWidths.time);
    if (this.assetWidths.length == this.timeWidths.length && this.assetWidths.length == this.transactions.length) {
      this.setWidestWidths();
    }
  }

  setWidthStyles(widestWidths) {
    // this is to be run on window resize
    // it should actually update the styles to the transaction service according to the correct screen size
    const size = this.data.windowSize(this.window.width);
    if (size == 'desktop') {
      this.widestWidthStyles.entryStyle = null;
      this.widestWidthStyles.assetStyle = {'flex-basis': widestWidths.asset};
      this.widestWidthStyles.blockStyle = {'flex-basis': widestWidths.block};
      this.widestWidthStyles.timeStyle = {'flex-basis': widestWidths.time};
    } else if (size == 'tablet') {
      this.widestWidthStyles.entryStyle = { 'grid-template-columns': widestWidths.asset + '  auto   1fr  ' + widestWidths.time };
      this.widestWidthStyles.blockStyle = null;
      this.widestWidthStyles.assetStyle = null;
      this.widestWidthStyles.timeStyle = null;
    } else if (size == 'mobile') {
      this.widestWidthStyles.entryStyle = null;
      this.widestWidthStyles.assetStyle = null;
      this.widestWidthStyles.blockStyle = null;
      this.widestWidthStyles.timeStyle = null;
    }
    // console.log(this.widestWidths)
    this.txs.widestWidthStyles.next(this.widestWidthStyles);
  }

  setWidestWidths() {
    // this is to be run when the transaction list changes
    // it should assess the widest entries in the list
    let widestAsset = 0;
    let widestBlock = 0;
    let widestTime = 0;

    this.assetWidths.forEach(assetWidth => {
      if (assetWidth > widestAsset) {
        widestAsset = assetWidth;
      }
    });

    this.blockWidths.forEach(blockWidth => {
      if (blockWidth > widestBlock) {
        widestBlock = blockWidth;
      }
    });

    this.timeWidths.forEach(timeWidth => {
      if (timeWidth > widestTime) {
        widestTime = timeWidth;
      }
    });

    this.widestWidths = {
      'asset': widestAsset + 'px',
      'block': widestBlock + 'px',
      'time': widestTime + 'px'
    };

    this.setWidthStyles(this.widestWidths);
  }

  ngAfterViewInit() {
    this.setWidestWidths();
    if (this.incomingTx) {
      this.dotLocation.emit(this.dotInfo);
    }
  }

  ngOnInit() {
    this.setWidestWidths();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.widestWidthsSubscription.unsubscribe();
    this.transactionSubscription.unsubscribe();
  }
}
