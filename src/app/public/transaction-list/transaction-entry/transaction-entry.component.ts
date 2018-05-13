import { AfterViewInit, Component, ElementRef, EventEmitter,  HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {TransactionInformation} from "../../../shared/model/transaction-information";
import {DataShareService} from "../../../core/data-share.service";
import {TransactionService, ListWidths} from "../transaction.service";

@Component({
  selector: 'app-transaction-entry',
  templateUrl: './transaction-entry.component.html',
  styleUrls: ['./transaction-entry.component.scss'],
  host: {
    '[style.background]': `this.hover ?
      this.theme.primaryColorOp1 :
      'transparent'`
  }
})
export class TransactionEntryComponent implements OnInit {

	@Input() transaction: TransactionInformation;
  @Input() theme;
  @Output() loaded = new EventEmitter();

  @ViewChild('asset') _asset: ElementRef;
  @ViewChild('block') _block: ElementRef;
  @ViewChild('time') _time: ElementRef;
  @ViewChild('assetSpan') _assetSpan: ElementRef;
  @ViewChild('blockSpan') _blockSpan: ElementRef;
  @ViewChild('timeSpan') _timeSpan: ElementRef;

  @HostListener('mouseover')
  onMouseOver() {
    this.hover = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hover = false;
  }
  public hover = false;
  public widestWidthsSubscription: Subscription;
  public widestWidthStylesSubscription: Subscription;

  
  public widestWidthStyles = {
    'entryStyle': {},
    'assetStyle': {},
    'blockStyle': {},
    'timeStyle': {}
  }

  public itemWidths = {
    'asset': null,
    'block': null,
    'time': null
  }

  public monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor(public data: DataShareService,
              public txs: TransactionService) {
    this.widestWidthStylesSubscription = this.txs.widestWidthStyles.subscribe(widestWidthStyles => {
      console.log(widestWidthStyles)
      this.widestWidthStyles = widestWidthStyles;
      // setTimeout(() => { // this actually works but looks bad
      //   this.widestWidthStyles = widestWidthStyles;
      //  },0);
    });
  }

  updateWidths() {
    this.itemWidths.asset = this._assetSpan.nativeElement.offsetWidth;
    this.itemWidths.block = this._blockSpan.nativeElement.offsetWidth;
    this.itemWidths.time = this._timeSpan.nativeElement.offsetWidth;
  }

  triggerListCalibration() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateWidths();
  }

  ngAfterViewInit() {

    this.updateWidths();
    this.loaded.emit(this.itemWidths);

  }

  ngOnInit() {

  }

  onClick() {
    const win = window.open("https://etherscan.io/tx/0x" + this.transaction.hash, '_blank');
    win.focus();
  }

}
