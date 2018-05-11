import { AfterViewChecked, Component, ElementRef, OnInit, Self, ViewChildren } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";
import {Block16Service} from "../../core/block16.service";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

	public transactions = [];
  public theme: Theme;
  private themeSubscription: Subscription;
  private transactionSubscription: Subscription;
  // @ViewChildren(TransactionEntry) transactionEntries;

  ngAfterViewInit() { // or some event handler
  }
  constructor(
    @Self() private host: ElementRef,
    private themeService: ThemeService,
    private block16Service: Block16Service
  ) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });

    this.transactionSubscription = this.block16Service.recentTransactions.subscribe((txs) => {
      this.transactions = txs;
    });

  }
  
  ngAfterViewChecked() {
    // transactionEntries.toArray()[0].nativeElement.classList.add('isActive');
    // console.log(this.host.nativeElement.offsetWidth);
    // console.log(this.host.nativeElement.outerWidth);
  }

  ngOnInit() {
  }

}
