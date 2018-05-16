import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {DataShareService} from "../../../core/data-share.service";
import {TransactionService, ListWidths} from "../transaction.service";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../../shared/model/theme/theme";

@Component({
  selector: 'app-transaction-list-legend',
  templateUrl: './transaction-list-legend.component.html',
  styleUrls: ['./transaction-list-legend.component.scss', '../transaction-entry/transaction-entry.component.scss']
})
export class TransactionListLegendComponent implements OnInit {

	public theme: Theme;
	private themeSubscription: Subscription;
  public widestWidthStylesSubscription: Subscription;
	
	public entryStyle = null;
  public assetStyle = null;
  public blockStyle = null;
  public timeStyle = null;
	public widestWidthStyles = {
    'entryStyle': {},
    'assetStyle': {},
    'blockStyle': {},
    'timeStyle': {}
  }
  public window = {'width': window.innerWidth,
                 'height': window.innerHeight};
  
  @ViewChild('asset') _asset: ElementRef;
  @ViewChild('block') _block: ElementRef;
  @ViewChild('time') _time: ElementRef;
  
  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.window.width = event.target.innerWidth;
      this.window.height = event.target.innerHeight;
  }
  
	constructor(
	  private themeService: ThemeService,
	  private txs: TransactionService,
	  public data: DataShareService
	) {
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
	  
	  this.widestWidthStylesSubscription = this.txs.widestWidthStyles.subscribe(widestWidthStyles => {
	  	this.widestWidthStyles = widestWidthStyles;
	  });
	}
  

  ngOnInit() {
  }

}
